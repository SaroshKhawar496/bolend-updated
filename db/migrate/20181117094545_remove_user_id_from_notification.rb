class RemoveUserIdFromNotification < ActiveRecord::Migration[5.2]
  def change
    remove_column :notifications, :user_id, :integer
  end
end
