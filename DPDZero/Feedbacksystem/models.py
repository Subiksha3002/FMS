from django.db import models
from django.contrib.auth.models import AbstractUser



class User(AbstractUser):
    """
    Custom user model that extends the default Django user model.
    """
    ROLE = (
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    )
    username = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True, blank=False, null=False)
    password = models.CharField(max_length=128)
    role = models.CharField(max_length=10, choices=ROLE)
    manager = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    # username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "userinfo"

class Feedback(models.Model):
    """
    Model to store feedback information.
    """

    FEEDBACK_CHOICES = [
        ('positive', 'Positive Feedback'),
        ('constructive', 'Constructive Feedback'),
        ('recognition', 'Recognition'),
        ('development', 'Developmental Feedback')
    ]
    STRENGTH_CHOICES = [
        ('communication', 'Communication Skills'),  
        ('teamwork', 'Teamwork and Collaboration'),
        ('problem_solving', 'Problem Solving'),
        ('leadership', 'Leadership'),
        ('technical_skills', 'Technical Skills'),
        ('adaptability', 'Adaptability'),
        ('initiative', 'Initiative'),
        ('time_management', 'Time Management')  
    ]

    AREAS_CHOICES = [
        ('communication', 'Communication Skills'),      
        ('teamwork', 'Teamwork and Collaboration'),
        ('problem_solving', 'Problem Solving'),
        ('leadership', 'Leadership'),
        ('technical_skills', 'Technical Skills'),
        ('adaptability', 'Adaptability'),
        ('initiative', 'Initiative'),
        ('time_management', 'Time Management')
    ]

    employee = models.ForeignKey(User, related_name='received_feedback', on_delete=models.CASCADE)
    manager = models.ForeignKey(User, related_name='given_feedback', on_delete=models.CASCADE)
    feedback_date = models.DateField(auto_now_add=True)
    performance_period = models.CharField(max_length=100)  # E.g., "Q1 2025"
    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_CHOICES)
    key_strengths = models.TextField(max_length=500, choices=STRENGTH_CHOICES)
    areas_for_improvement = models.TextField(default="To be updated")
    acknowledgment = models.BooleanField(default=False)

    
    # development_opportunities = models.TextField()
    # personal_growth = models.TextField()
    # manager_signature = models.CharField(max_length=100)
    # employee_signature = models.CharField(max_length=100, blank=True, null=True)


    class Meta:
        db_table = "feedback"
        ordering = ['-feedback_date']
        

    def __str__(self):
        return f"Feedback from {self.user.email} at {self.created_at}"


    # employee_comments = models.TextField(blank=True, null=True)
    
   