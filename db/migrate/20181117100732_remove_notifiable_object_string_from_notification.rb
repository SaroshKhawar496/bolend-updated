class RemoveNotifiableObjectStringFromNotification < ActiveRecord::Migration[5.2]
  def change
    remove_column :notifications, :notifiable_object_string, :string
  end
end
