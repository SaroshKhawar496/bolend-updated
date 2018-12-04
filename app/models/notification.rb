class Notification < ApplicationRecord

  #Sending the Notification Email 
  after_save :send_email
  # before_save :check_it


  belongs_to :recipient, class_name: "User"
  belongs_to :sender, class_name: "User"
  belongs_to :notifiable_object, polymorphic: true #notifiable object doesn't have one type


  scope :unread, ->{ where(read_at: nil)}

  # def check_it
  #   puts("GOING TO SAVE THE NOTIFICATION")
  # end

  #Email funciton
  def send_email
  	# Check the notification action here: 1.item_request => Item borrow Request Email, 2.accept_item_request => Your Request was Accepted
  	if (self[:action] == "item_request")
  		
  		# NotificationMailer.item_request_email(recepient_user).deliver

      recepient_user = User.find_by_id(self[:recipient_id])
      sending_user = User.find_by_id(self[:sender_id])

      request_id = (self[:notifiable_object_id])
      item = Item.find( (Request.find(request_id)).item_id );

      params = []
      params = Array.new
      params.push << recepient_user
      params.push << sending_user
      params.push << item

	    # puts("Requested Item is #{item.name}")
  		# NotificationMailer.item_request_email(recepient_user,sending_user,item_name).deliver
  		NotificationMailer.item_request_email(params).deliver

  	elsif (self[:action] == "accept_item_request")
      #the requestor
      recepient_user = User.find_by_id(self[:recipient_id])
      #the owner
      sending_user = User.find_by_id(self[:sender_id])
      
      #notifiable object in this case is the loan model
      loan_id = (self[:notifiable_object_id])
      loan = Loan.find(loan_id)
      item = Item.find(loan.item_id );
      
      params = []
      params = Array.new
      params.push << recepient_user
      params.push << sending_user
      params.push << item
      params.push << loan

      NotificationMailer.accept_item_request_email(params).deliver


      # For the Reminders
    elsif (self[:action] == "item_2d_overdue")
      # the borrower
      recepient_user = User.find_by_id(self[:recipient_id])
      #the owner
      sending_user = User.find_by_id(self[:sender_id])
      
      #notifiable object in this case is the loan model
      loan_id = (self[:notifiable_object_id])
      loan = Loan.find(loan_id)
      item = Item.find(loan.item_id );
      
      params = []
      params = Array.new
      params.push << recepient_user
      params.push << sending_user
      params.push << item
      # params.push << loan.duedate

      NotificationMailer.item_2d_overdue_email(params).deliver

    elsif (self[:action] == "item_1d_overdue")
      # puts("ITEM DUE TOMORROW. Here in Notification.rb file")

      # the borrower
      recepient_user = User.find_by_id(self[:recipient_id])
      #the owner
      sending_user = User.find_by_id(self[:sender_id])
      
      #notifiable object in this case is the loan model
      loan_id = (self[:notifiable_object_id])
      loan = Loan.find(loan_id)
      item = Item.find(loan.item_id );
      
      params = []
      params = Array.new
      params.push << recepient_user
      params.push << sending_user
      params.push << item
      # params.push << loan.duedate

      NotificationMailer.item_1d_overdue_email(params).deliver

    elsif (self[:action] == "item_due_today")
      # puts("ITEM DUE TOMORROW. Here in Notification.rb file")

      # the borrower
      recepient_user = User.find_by_id(self[:recipient_id])
      #the owner
      sending_user = User.find_by_id(self[:sender_id])
      
      #notifiable object in this case is the loan model
      loan_id = (self[:notifiable_object_id])
      loan = Loan.find(loan_id)
      item = Item.find(loan.item_id );
      
      params = []
      params = Array.new
      params.push << recepient_user
      params.push << sending_user
      params.push << item
      # params.push << loan.duedate

      NotificationMailer.item_due_today_email(params).deliver      

    elsif (self[:action] == "item_due_tomorrow")
      # puts("ITEM DUE TOMORROW. Here in Notification.rb file")
            # the borrower
      recepient_user = User.find_by_id(self[:recipient_id])
      #the owner
      sending_user = User.find_by_id(self[:sender_id])
      
      #notifiable object in this case is the loan model
      loan_id = (self[:notifiable_object_id])
      loan = Loan.find(loan_id)
      item = Item.find(loan.item_id );
      
      params = []
      params = Array.new
      params.push << recepient_user
      params.push << sending_user
      params.push << item
      # params.push << loan.duedate

      NotificationMailer.item_due_tomorrow_email(params).deliver

    elsif (self[:action] == "item_due_dayAfterTomorrow")
      # puts("ITEM DUE TOMORROW. Here in Notification.rb file")
            # the borrower
      recepient_user = User.find_by_id(self[:recipient_id])
      #the owner
      sending_user = User.find_by_id(self[:sender_id])
      
      #notifiable object in this case is the loan model
      loan_id = (self[:notifiable_object_id])
      loan = Loan.find(loan_id)
      item = Item.find(loan.item_id );
      
      params = []
      params = Array.new
      params.push << recepient_user
      params.push << sending_user
      params.push << item
      # params.push << loan.duedate

      NotificationMailer.item_due_dayAfterTomorrow_email(params).deliver



    end

  end

end
