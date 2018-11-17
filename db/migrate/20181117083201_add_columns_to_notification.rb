class AddColumnsToNotification < ActiveRecord::Migration[5.2]
  def change
    add_column :notifications, :recipient_id, :integer
    add_column :notifications, :sender_id, :integer
    add_column :notifications, :read_at, :datetime
    add_column :notifications, :action, :string
    add_column :notifications, :notifiable_object_id, :integer
    add_column :notifications, :notifiable_object_string, :string
  end
end
