class AddBase64ToItems < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :base64, :string
  end
end
