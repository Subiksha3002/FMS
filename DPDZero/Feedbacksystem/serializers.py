from rest_framework import serializers
from .models import User, Feedback

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email', 'password', 'role']
       
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user 

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'  
        read_only_fields = ['feedback_date']
    
    def create(self, validated_data):
        feedback = Feedback(**validated_data)
        feedback.save()
        return feedback

class ReceivedFeedbackSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(source='employee.username', read_only=True)
    manager_name = serializers.CharField(source='manager.username', read_only=True)

    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['feedback_date']