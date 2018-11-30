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

  test "loan has updated_at timestamp" do
    assert_not_nil loans(:book_loan).updated_at
  end

  test "loan has duedate timestamp" do
    assert_not_nil loans(:book_loan).duedate
  end

  test "loan compare duedate" do
    assert_equal(loans(:book_loan).duedate, '2018-11-30 20:40:06.029348')
  end
end
