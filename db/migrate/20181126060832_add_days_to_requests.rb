class AddDaysToRequests < ActiveRecord::Migration[5.2]
  def change
    add_column :requests, :days, :integer
  end
end
