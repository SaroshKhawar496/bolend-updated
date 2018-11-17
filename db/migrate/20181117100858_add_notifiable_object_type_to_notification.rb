class AddNotifiableObjectTypeToNotification < ActiveRecord::Migration[5.2]
  def change
    add_column :notifications, :notifiable_object_type, :string
  end
end
