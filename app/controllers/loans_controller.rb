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
        @loan = @requesting_user.loans.new(item: @requested_item)
        if @loan.save
          @request.destroy # I don't think there is any point of keeping the request entry if it has been approved
          render :show, status: :created, location: @loan
        else
          render json: @loan.errors, status: :unprocessable_entity
        end  
      end
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