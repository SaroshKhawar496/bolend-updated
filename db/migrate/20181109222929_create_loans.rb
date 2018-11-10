class CreateLoans < ActiveRecord::Migration[5.2]
  def change
    create_table :loans do |t|
      t.references :user, foreign_key: true
      t.references :item, foreign_key: true

      t.timestamps
    end
  end
end
