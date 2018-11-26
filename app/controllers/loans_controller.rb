class LoansController < ApplicationController

  def index
    @user = User.find(current_user.id)
  end

  def create
    @request = Request.find(params[:request_id])
    @requesting_user = @request.user
    if @requesting_user != current_user #shouldn't be able to accept your own requests
      @requested_item = @request.item
      if current_user.items.include? @requested_item #should only be able to approve items that you own
        duration = @request.days
        due_date = duration.days.from_now
        @loan = @requesting_user.loans.new(item: @requested_item, duedate: due_date.utc.end_of_day)
        if @loan.save
          @request.destroy # I don't think there is any point of keeping the request entry if it has been approved

          Notification.create(recipient: @requesting_user, sender: current_user, action: "accept_item_request", notifiable_object: @loan)


          render :show, status: :created, location: @loan
        else
          render json: @loan.errors, status: :unprocessable_entity
        end  
      else
        render json: {"message": "This item does not belong to you"}, status: :forbidden
      end
    else
      render json: {"message": "error"}, status: :unprocessable_entity
    end  
  end

  def show
    @loan = Loan.find(params[:id])
  end

end

# For accepting requests / creating loans using REST client
#
# POST http://localhost:3000/api/loans
#
# JSON Payload:
# {
#   "request_id": <Request ID>
# }
#


#Notification for the requestor will be generated when you accept a request ie loaning it.
#Request will be deleted after loan is saved.