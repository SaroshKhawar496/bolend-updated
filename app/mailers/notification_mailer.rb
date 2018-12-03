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

  def item_2d_overdue_email(params)

    @recipientUser = params[0]
    @senderUser = params[1]
    @item = params[2]

    mail to: params[0].email, subject: "Your Item Loan Is 2 Days Overdue"

  end

  def item_1d_overdue_email(params)
    @recipientUser = params[0]
    @senderUser = params[1]
    @item = params[2]

    mail to: params[0].email, subject: "Your Item Loan Is 1 Day Overdue"
  end

  def item_due_today_email(params)
    @recipientUser = params[0]
    @senderUser = params[1]
    @item = params[2]

    mail to: params[0].email, subject: "Your Item Loan Is Due Today"
  end

  def item_due_tomorrow_email(params)
    @recipientUser = params[0]
    @senderUser = params[1]
    @item = params[2]

    mail to: params[0].email, subject: "Your Item Loan Is Due Tomorrow"
  end

  def item_due_dayAfterTomorrow_email(params)
    @recipientUser = params[0]
    @senderUser = params[1]
    @item = params[2]

    mail to: params[0].email, subject: "Your Item Loan Is Due Day After Tomorrow"
  end
  
  
  

end
