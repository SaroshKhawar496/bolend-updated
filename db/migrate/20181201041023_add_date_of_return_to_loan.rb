class AddDateOfReturnToLoan < ActiveRecord::Migration[5.2]
  def change
    add_column :loans, :date_of_return, :datetime
  end
end
