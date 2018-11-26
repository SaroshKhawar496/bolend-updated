class AddDuedateToLoans < ActiveRecord::Migration[5.2]
  def change
    add_column :loans, :duedate, :datetime
  end
end
