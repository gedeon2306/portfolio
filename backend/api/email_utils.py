from django.conf import settings
from django.core.mail import send_mail

def send_login_email(user):

    code = user.validate_code

    subject = "Connexion à votre Portfolio"
    message = (
        f"Bonjour {user.name},\n\n"
        f"Votre code de connexion est : {code}\n\n"
        "Ce code expire dans 10 minutes.\n\n"
        "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email."
    )

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [settings.EMAIL_USER],
        fail_silently=False,
    )
