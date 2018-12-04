namespace :csc444 do

	desc "Checks item date of return 2,1 days before, overdue and generate Notifications/emails"
	require 'action_view'
	require 'action_view/helpers'
	include ActionView::Helpers::DateHelper
	require 'active_support/all'

	task :item_overdue_notifier => :environment do

		# a) for every loaned out item, compare the date of return with today's date.
		# b) Scenarios To Act On:
		# 1. date of return is 2 days after today
		# 2. date of return is 1 day after today
		# 3. date of return is today
		# 4. date of return was 1 day before today (1 day overdue)
		# 5. date of return was 2 days before today (2 days overdue)
		# c) for every scenario, create a notification object
		@current_loans = Loan.all

		for loaned in @current_loans
			if (loaned.date_of_return == nil)
				current_time = Time.now.utc
				item_id = loaned.item_id
				borrower_id = loaned.user_id
				date_of_return = loaned.duedate.to_s

				# puts("TIme.current: "+ current_time.to_s)
				# puts("Time.zone.now: "+Time.zone.now.to_s)
				# puts("Time.utc "+Time.now.utc.to_s)

				puts ("Loaned item_id: #{item_id} | Loaned to User: #{borrower_id} | DueDate: #{date_of_return}")
				# if (Time.now())
				# end
				time_diff = Time.parse(date_of_return)-Time.current
				rounded_off_days_difference = (time_diff/ 1.day).round

				puts (rounded_off_days_difference)

				notif_recipient = User.find_by_id(borrower_id)
				puts("notif_recipient: #{notif_recipient}")

				loaned_item = Item.find_by_id(item_id)
				puts("loaned_item: #{loaned_item}")

				sender_user = User.find_by_id(loaned_item.user_id)
				puts("sender_user: #{sender_user}")

				# Notification.create(recipient: @item.user, sender: current_user, action: "item_request", notifiable_object: @request)
				# Notification.create(recipient: @requesting_user, sender: current_user, action: "accept_item_request", notifiable_object: @loan)
				# if (self[:action] == "item_request")

				case rounded_off_days_difference
				when -2
					puts ("item is 2 days overdue")
					Notification.create(recipient: notif_recipient, sender: sender_user, action: "item_2d_overdue", notifiable_object: loaned)
				when -1
					Notification.create(recipient: notif_recipient, sender: sender_user, action: "item_1d_overdue", notifiable_object: loaned)
					puts ("item is 1 day overdue")
				when 0
					Notification.create(recipient: notif_recipient, sender: sender_user, action: "item_due_today", notifiable_object: loaned)
					puts("item is due today")
				when 1
					Notification.create(recipient: notif_recipient, sender: sender_user, action: "item_due_tomorrow", notifiable_object: loaned)
					puts("Item due tomorrow")
					
				when 2
					Notification.create(recipient: notif_recipient, sender: sender_user, action: "item_due_dayAfterTomorrow", notifiable_object: loaned)
					puts("Item due day after tomorrow")
				end


			end
		end


		# puts (Time.now())

		# puts("current_loans are: #{@current_loans}")
		puts("IT WORKED")


	end
end