class NotificationMailer < ApplicationMailer
  default from: GMAIL_USERNAME

  def item_request_email(user)
    @user = user

    mail to: user.email, subject: "Your Item Has Been Requested"
  end
end
