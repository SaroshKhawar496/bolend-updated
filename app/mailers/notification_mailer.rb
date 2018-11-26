class NotificationMailer < ApplicationMailer
  default from: ENV["GMAIL_USERNAME"]

  def item_request_email(params)
  	@recipientUser = params[0]
  	@senderUser = params[1]
  	@item = params[2]
  	
    mail to: params[0].email, subject: "Your Item Has Been Requested"
  end
end
