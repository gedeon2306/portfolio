from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailConfirmationTokenGenerator(PasswordResetTokenGenerator):
    """Token de confirmation avec une durée courte."""

    def __init__(self):
        super().__init__()
        self._timeout = 600

    def check_token(self, user, token):
        from django.conf import settings

        original_timeout = getattr(settings, 'PASSWORD_RESET_TIMEOUT', 259200)

        try:
            settings.PASSWORD_RESET_TIMEOUT = self._timeout
            return super().check_token(user, token)
        finally:
            settings.PASSWORD_RESET_TIMEOUT = original_timeout


email_confirmation_token_generator = EmailConfirmationTokenGenerator()
