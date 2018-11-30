require 'test_helper'

class LoanTest < ActiveSupport::TestCase
  test "loan exists" do
    assert loans(:book_loan)
  end

  test "loan has a user" do
    assert_not_nil loans(:book_loan).user_id
  end

  test "loan has an item" do
    assert_not_nil loans(:book_loan).item_id
  end

  test "loan has created_at timestamp" do
    assert_not_nil loans(:book_loan).created_at
  end
end
