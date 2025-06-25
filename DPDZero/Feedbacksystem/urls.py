from django.urls import path
from .views import RegisterView, UserView, LogoutView ,FeedbackView,FeedbackHistoryView,ReceivedfeedbackView,ManagerUpdateFeedbackView,EmployeeacknowledgeView, TeamOverView ,EmployeetimeLineView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    # path('login/', LoginView.as_view(), name='login'),
    path('userview/', UserView.as_view(), name='userview'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('givefb/', FeedbackView.as_view(), name='feedback'),
    path('fbhistory/<int:employee_id>/', FeedbackHistoryView.as_view(), name='feedback_history'),
    path('fbreceived/', ReceivedfeedbackView.as_view(), name='feedback_received'),
    path('fbupdate/<int:employee_id>/', ManagerUpdateFeedbackView.as_view(), name='feedback_update'),
    path('fb_acknowledge/<int:feedback_id>/', EmployeeacknowledgeView.as_view(), name='feedback_acknowledge'),
    path('fb_count/', TeamOverView.as_view(), name='feedback_count'),
    path('fb_timeline/', EmployeetimeLineView.as_view(), name='feedback_timeline'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
]