from django.shortcuts import render
from rest_framework.views import APIView 
from .serializers import UserSerializer, FeedbackSerializer, ReceivedFeedbackSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
import jwt, datetime
from rest_framework import permissions
from .authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from .models import Feedback
from django.db.models import Count
from rest_framework_simplejwt.views import TokenObtainPairView


User = get_user_model()

class RegisterView(APIView):
    """
    View to handle user registration.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        
        username = request.data.get('username')
        email = request.data.get('email')
        manager_id = request.data.get('manager_id') 
        role = request.data.get('role')

        if User.objects.filter(username=request.data.get('username')).exists():
            return Response({'error': 'Username already taken'}, status=400)

        if User.objects.filter(email=request.data.get('email')).exists():
            return Response({'error': 'Email already registered'}, status=400)

        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if role not in ['manager', 'employee']:
            return Response({'error': 'Invalid role'}, status=400)

        if role == 'employee' and not User.objects.filter(id=manager_id, role='manager').exists():
            return Response({'error': 'Invalid manager ID'}, status=400)

        # if you select employee need to specify the manager id to connect them under the particular manager team
        if role == 'employee':
            serializer.validated_data['manager'] = User.objects.get(id=manager_id)

        serializer.save()
        return Response(serializer.data, status=201)

# class LoginView(APIView):
#     """
#     View to handle user login.
#     """
#     permission_classes = [AllowAny]

#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         user = User.objects.filter(username=username).first()
#         if user is None:
#             raise AuthenticationFailed('User not found')
#         if not user.check_password(password):
#             raise AuthenticationFailed('Incorrect password')
        
#         payload = {
#             'id': user.id,
#             'username': user.username,
#             'role': user.role,
#             'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),  
#             'iat': datetime.datetime.utcnow()
#         }
#         # print(f"Payload before encoding: {payload}")
#         # print(f"User role: {user.username}")
    

#         token = jwt.encode(payload,'secret', algorithm='HS256')
#         # return Response({
#         #     'token': token,
#         #     'role': user.role
#         # }, status=status.HTTP_200_OK)

#         response = Response()
#         response.set_cookie(key='jwt', value=token, httponly=True)
#         response.data = {  
#             'jwt': token,
#             'role': user.role,
#             'username': user.username
#         }    
#         return response
#         print(f"Token: {token}")


class UserView(APIView):
    """
    View to handle user details and allow managers to see their team members.
    """
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  
        # only manager can view
        if user.role.lower() == 'manager':
            team_members = User.objects.filter(manager=user)
            serializer = UserSerializer(team_members, many=True)
        else:
            serializer = UserSerializer(user)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    # def get(self, request):
    #     token = request.COOKIES.get('jwt')
    #     if not token:
    #         raise AuthenticationFailed('Unauthenticated')

    #     try:
    #         payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    #     except jwt.ExpiredSignatureError:
    #         raise AuthenticationFailed('Token expired')
    #     except jwt.DecodeError:
    #         raise AuthenticationFailed('Invalid token')

        # user = User.objects.filter(id=payload['id']).first()
        # if user is None:
        #     raise AuthenticationFailed('User not found')

        # if user.role == 'manager':
        #     team_members = User.objects.filter(manager=user)
        #     serializer = UserSerializer(team_members, many=True)
        #     return Response(serializer.data, status=status.HTTP_200_OK)

        # serializer = UserSerializer(user)
        # return Response(serializer.data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    """
    View to handle user logout.
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        response = Response()
        #cookies will be cleared 
        response.delete_cookie('jwt')
        response.data = {'message': 'Logged out successfully'}
        return response

class FeedbackView(APIView):
    """
    View to handle feedback submission.
    """

    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if not user.role or user.role.lower() != 'manager':
            return Response({"error": "Only managers can submit feedback."}, status=403)

        employee_username = request.data.get('employee_name')
        if not employee_username:
            return Response({"error": "Employee name is required."}, status=400)

        try:
            employee = User.objects.get(username=employee_username, manager=user, role__iexact='employee')
        except User.DoesNotExist:
            return Response({"error": "Employee not found under this manager."}, status=404)

        data = request.data.copy()
        data['manager'] = user.id
        data['employee'] = employee.id
        # data['employee_name'] = employee.username
        # data.pop('employee_name', None)

        serializer = FeedbackSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=400)

class FeedbackHistoryView(APIView):
    """
    View to retrieve feedback history for an employee.
    """

    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, employee_id):
        user = request.user
        
        #only manager and the respective employee can view the feedback history

        if user.role.lower() != 'manager':
            return Response({"error": "Only managers can view feedback history."}, status=403)

        try:
            employee = User.objects.get(id=employee_id, manager=user, role__iexact='employee')
        except User.DoesNotExist:
            return Response({"error": "Employee not found under this manager."}, status=404)

        feedbacks = employee.received_feedback.all()
        serializer = FeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data, status=200)

class ReceivedfeedbackView(APIView):
    """
    View to retrieve feedback received by the logged-in user.
    """

    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role.lower() != 'employee':
            return Response({"error": "Only employees can view their feedback."}, status=403)

        feedbacks = user.received_feedback.all()
        serializer = ReceivedFeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data, status=200)

class ManagerUpdateFeedbackView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, employee_id):
        user = request.user

        # only manager can update it using the auth token

        if user.role.lower() != 'manager':
            return Response({"error": "Only managers can update feedback."}, status=403)
        
        try:
            employee = User.objects.get(id=employee_id, manager=user, role__iexact='employee')
        except User.DoesNotExist:
            return Response({"error": "Employee not found under this manager."}, status=404)

      
        feedback_id = request.data.get('feedback_id')
        if not feedback_id:
            return Response({"error": "Feedback ID is required."}, status=400)

    
        try:
            feedback = Feedback.objects.get(id=feedback_id, employee=employee, manager=user)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found for this employee under this manager."}, status=404)

        serializer = FeedbackSerializer(feedback, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)

        return Response(serializer.errors, status=400)

class EmployeeacknowledgeView(APIView):
    """
    View to handle employee acknowledgement of feedback.
    """

    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request, feedback_id):
        user = request.user

        # to acknowledge is a partiular field so

        if user.role.lower() != 'employee':
            return Response({"error": "Only employees can acknowledge feedback."}, status=403)

        try:
            feedback = Feedback.objects.get(id=feedback_id, employee=user)
        except Feedback.DoesNotExist:
            return Response({"error": "Feedback not found or not assigned to you."}, status=404)

        feedback.acknowledged = True
        feedback.save()

        return Response({"message": "Feedback acknowledged successfully."}, status=200)

class TeamOverView(APIView):
    """
    View to provide an overview of the team for managers.
    """

    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        #using Auth token

        manager = request.user
        if manager.role != 'manager':
            return Response({'error': 'Only managers can access this'}, status=403)

        team_members = User.objects.filter(manager=manager)
        feedbacks = Feedback.objects.filter(employee__in=team_members)

        feedback_count = feedbacks.count()

        sentiment_trends = feedbacks.values('feedback_type').annotate(count=Count('id'))

        return Response({
            'feedback_count': feedback_count,
            'sentiment_trends': sentiment_trends,
        })
    
class EmployeetimeLineView(APIView):
    """
    View to provide a timeline of feedback for employees.
    """

    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        employee = request.user
        if employee.role != 'employee':
            return Response({'error': 'Only employees can access this'}, status=403)

        feedbacks = Feedback.objects.filter(employee=employee).order_by('-feedback_date')

        data = [{
            'period': f.performance_period,
            'type': f.feedback_type,
            'strengths': f.key_strengths,
            'improvements': f.areas_for_improvement,
            'date': f.feedback_date.strftime('%Y-%m-%d'),
        } for f in feedbacks]

        return Response({'timeline': data})