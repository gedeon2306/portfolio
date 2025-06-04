from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class SentEmail(models.Model):
    nom = models.CharField(max_length=100)
    email = models.EmailField()
    sujet = models.CharField(max_length=100)
    message = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Email de {self.nom} ({self.email})"

    class Meta:
        verbose_name = "Email"
        verbose_name_plural = "Emails"

class Skills(models.Model):
    competence = models.CharField(max_length=50)

    def __str__(self):
        return self.competence

    class Meta:
        verbose_name = "Compétence"
        verbose_name_plural = "Compétences"

class Skills_list(models.Model):
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

class Projets(models.Model):
    titre = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='static/projets/', blank=True, null=True)
    demo = models.URLField(blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    doc = models.FileField(upload_to='static/docs/', blank=True, null=True)
    code = models.URLField(blank=True, null=True)
    important = models.BooleanField(default=False)

    def __str__(self):
        return self.titre

    class Meta:
        verbose_name = "Projet"
        verbose_name_plural = "Projets"

class Technologies(models.Model):
    project = models.ForeignKey(Projets, on_delete=models.CASCADE, related_name='tec_projets')
    technologie = models.ForeignKey(Skills_list, on_delete=models.CASCADE, related_name='tec_skills')

    def __str__(self):
        return self.technologie.libelle

    class Meta:
        verbose_name = "Technologie"
        verbose_name_plural = "Technologies"

class MyInfo(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    localisation = models.CharField(max_length=100)
    profession = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='static/images/', null=True, blank=True)
    cv = models.FileField(upload_to='static/cv/', null=True, blank=True)
    formation = models.CharField(max_length=100)
    experience = models.CharField(max_length=100)
    passions = models.CharField(max_length=100)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    twitter_x = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.nom} {self.prenom}"

    class Meta:
        verbose_name = "Mon Info"
        verbose_name_plural = "Mes Infos"