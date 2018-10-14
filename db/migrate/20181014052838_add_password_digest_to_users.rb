class AddPasswordDigestToUsers < ActiveRecord::Migration[5.2]
  def change
  	#adding password_digest column for pwd encryption in users table
  	add_column :users, :password_digest, :string

  end
end
