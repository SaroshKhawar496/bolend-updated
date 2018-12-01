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
        if @request.status == 'accepted'
          render json: {"message": "You have already accepted this request"}, status: :forbidden
        elsif @request.status == 'declined'
          render json: {"message": "This request was already declined by you."}, status: :forbidden
        else #if status is null or pernding, null is needed because of all existing requests that don't have status set to pending
          #render json: {"message": "The status value of this request is null or it doesn't exist, which is no longer allowed. All requests now have a status value which is 'pending' by default and becomes 'accepted' after loan is created or 'declined' when item owner chooses to specifically decline your request or choose another user to loan to."}, status: :unprocessable_entity
          duration = @request.days
          due_date = duration.days.from_now
          @loan = @requesting_user.loans.new(item: @requested_item, duedate: due_date.utc.end_of_day)
          if @loan.save
            #@request.destroy # I don't think there is any point of keeping the request entry if it has been approved
            @request.update_attributes(:status => 'accepted')
            
            #decline all other requests on item
            @requested_item.requests.each do |request|
              if request.status != 'accepted' && request.status != 'declined'
                request.update_attributes(:status =>'declined')
              end
            end

            Notification.create(recipient: @requesting_user, sender: current_user, action: "accept_item_request", notifiable_object: @loan)


            render :show, status: :created, location: @loan
          else
            render json: @loan.errors, status: :unprocessable_entity
          end 
        end
      else
        render json: {"message": "This item does not belong to you"}, status: :forbidden
      end
    else
      render json: {"message": "You created this request. Can't accept your own request."}, status: :unprocessable_entity
    end  
  end

  def mark_as_returned
    @loan = Loan.find(params[:id])
    if current_user.id == @loan.item.user.id
      if @loan.date_of_return != nil
        render json: {"message": "This loan was already terminated on #{@loan.date_of_return}"}, status: :conflict
      else  
        @loan.update_attributes(:date_of_return => Time.zone.now)
        render json: {"message": "Loan successfully terminated."}, status: :ok
      end
    else
      render json: {"message": "Borrowed item does not belong to you"}, status: :forbidden
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