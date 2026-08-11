import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'utilisateur doit avoir une adresse email.")
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'Administrateur')

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Le superutilisateur doit avoir is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Le superutilisateur doit avoir is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=255, unique=True)
    
    role = models.CharField(max_length=50, default='Utilisateur')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    dfa = models.BooleanField(default=True)
    
    validate_code = models.CharField(max_length=6, blank=True, null=True)
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Dashboard(models.Model):
    # Informations sur la page
    path = models.CharField(max_length=500, db_index=True, help_text="URL consultée (ex: /projects/my-app/)")
    method = models.CharField(max_length=10, default="GET")
    
    # Origine du trafic
    referrer = models.URLField(max_length=500, blank=True, null=True, help_text="Site d'origine du visiteur")
    
    # Informations sur le visiteur
    ip_address = models.GenericIPAddressField(blank=True, null=True, help_text="Adresse IP (peut être anonymisée)")
    user_agent = models.CharField(max_length=255, blank=True, null=True, help_text="Navigateur / Système d'exploitation")
    session_key = models.CharField(max_length=40, blank=True, null=True, db_index=True)
    
    # Type d'appareil (optionnel mais utile)
    device_type = models.CharField(
        max_length=20,
        choices=[
            ('desktop', 'Desktop'),
            ('mobile', 'Mobile'),
            ('tablet', 'Tablet'),
            ('bot', 'Bot / Crawler'),
            ('other', 'Autre'),
        ],
        default='other'
    )

    # Date et heure
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Page vue"
        verbose_name_plural = "Pages vues"
        # Index composé pour accélérer les requêtes d'analytics par URL et par date
        indexes = [
            models.Index(fields=['path', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.path} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"


class MyInfo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    localisation = models.CharField(max_length=100)
    profession = models.CharField(max_length=100)
    description1 = models.TextField()
    description2 = models.TextField()
    image = models.TextField(null=True, blank=True)
    cv = models.TextField(null=True, blank=True)
    formation = models.CharField(max_length=100)
    experience = models.CharField(max_length=100)
    passions = models.CharField(max_length=100)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    twitter_x = models.URLField(blank=True, null=True)
    tik_tok = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.nom} {self.prenom}"

    class Meta:
        verbose_name = "Mon Info"
        verbose_name_plural = "Mes Infos"


class Langues(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    NIVEAUX_CHOICES = [
        ('A1', 'A1'),
        ('A2', 'A2'),
        ('B1', 'B1'),
        ('B2', 'B2'),
        ('C1', 'C1'),
        ('C2', 'C2'),
    ]
    
    langue = models.CharField(max_length=50)
    niveau = models.CharField(max_length=2, choices=NIVEAUX_CHOICES)

    def __str__(self):
        return f"{self.langue} - {self.niveau}"

    class Meta:
        verbose_name = "Langue"
        verbose_name_plural = "Langues"  


class Skills(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    competence = models.CharField(max_length=50)

    def __str__(self):
        return self.competence

    class Meta:
        verbose_name = "Compétence"
        verbose_name_plural = "Compétences"


class Skills_list(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    skill = models.ForeignKey(Skills, on_delete=models.CASCADE, related_name='skills_list')
    libelle = models.CharField(max_length=20)
    pourcentage = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Entrez un nombre entier entre 1 et 100."
    )

    def __str__(self):
        return f"{self.libelle}"

    class Meta:
        verbose_name = "Liste de compétences"
        verbose_name_plural = "Listes de compétences"


class Projects(models.Model):
    PROJECT_CATEGORIES = [
        ('Web', 'Application Web'),
        ('Mobile', 'Application Mobile'),
        ('Desktop', 'Application Desktop'),
        ('Data base', 'Base de Données'),
        ('IA', 'Intelligence Artificielle'),
        ('DevOps', 'DevOps'),
        ('UI/UX', 'UI/UX Design'),
        ('Réseaux', 'Réseaux et Télécommunications'),
        ('Cybersécurité', 'Cybersécurité'),
        ('API', 'API'),
        ('Autre', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titre = models.CharField(max_length=100)
    categorie = models.CharField(max_length=100, choices=PROJECT_CATEGORIES)
    status = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    description = models.TextField()
    image = models.TextField(null=True, blank=True)
    url = models.URLField(blank=True, null=True)
    doc = models.TextField(null=True, blank=True)
    code_source = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titre

    class Meta:
        verbose_name = "Projet"
        verbose_name_plural = "Projets"


class Technologies(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name='tec_projets')
    technologie = models.ForeignKey(Skills_list, on_delete=models.CASCADE, related_name='tec_skills')

    def __str__(self):
        return self.technologie.libelle

    class Meta:
        verbose_name = "Technologie"
        verbose_name_plural = "Technologies"


class Certificates(models.Model):
    CERTIFICATION_CATEGORIES = [
        ('IA', 'Intelligence Artificielle'),
        ('Web', 'Développement Web'),
        ('Mobile', 'Développement Mobile'),
        ('Data Base', 'Base de Données'),
        ('DevOps', 'DevOps'),
        ('UI/UX', 'UI/UX Design'),
        ('Réseaux', 'Réseaux et Télécommunications'),
        ('Cybersécurité', 'Cybersécurité'),
        ('Langue', 'Langue'),
        ('Gestion de Projet', 'Gestion de Projet'),
        ('Marketing Digital', 'Marketing Digital'),
        ('Linux', 'Administration Linux'),
        ('Data', 'Science des Données'),
        ('Cloud', 'Cloud Computing'),
        ('Langage de Programmation', 'Langage de Programmation'),
        ('Autre', 'Autre'),
    ]
        
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    titre = models.CharField(max_length=100)
    categorie = models.CharField(max_length=100, choices=CERTIFICATION_CATEGORIES)
    organisme = models.CharField(max_length=100)
    annee = models.IntegerField(validators=[MinValueValidator(1900), MaxValueValidator(2100)])
    url = models.URLField(blank=True, null=True)
    description = models.TextField()
    image = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titre

    class Meta:
        verbose_name = "Certification"
        verbose_name_plural = "Certifications"


class Journal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    action = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.action

    class Meta:
        verbose_name = "Journal"
        verbose_name_plural = "Journaux"


class Settings(models.Model):
    titre_app = models.CharField(max_length=100)
    mode_maintenance = models.BooleanField(default=False)
    notification_email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return self.titre_app

    class Meta:
        verbose_name = "Paramètre"
        verbose_name_plural = "Paramètres"
