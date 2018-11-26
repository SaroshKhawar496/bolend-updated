class NotificationMailer < ApplicationMailer
  default from: ENV["GMAIL_USERNAME"]

  def item_request_email(params)
  	@recipientUser = params[0]
  	@senderUser = params[1]
  	@item = params[2]

    mail to: params[0].email, subject: "Your Item Has Been Requested"
  end

  def accept_item_request_email(params)
  	@recipientUser = params[0]
  	@senderUser = params[1]
  	@item = params[2]
  	@loan = params[3]

    mail to: params[0].email, subject: "Your Borrow Request Has Been Approved"
  end

end
