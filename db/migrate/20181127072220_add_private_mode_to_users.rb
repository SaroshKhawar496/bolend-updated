class AddPrivateModeToUsers < ActiveRecord::Migration[5.2]
	def change
		add_column :users, :privateMode, :boolean, default: false, null: false
	end
end
