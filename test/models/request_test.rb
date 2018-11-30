require 'test_helper'

class RequestTest < ActiveSupport::TestCase
  test "request exists" do
    assert requests(:book_request)
  end

  test "request has a user" do
    assert_not_nil requests(:book_request).user_id
  end

  test "request has an item" do
    assert_not_nil requests(:book_request).item_id
  end

  test "request has created_at timestamp" do
    assert_not_nil requests(:book_request).created_at
  end

  test "request has updated_at timestamp" do
    assert_not_nil requests(:book_request).updated_at
  end

  test "request has days" do
    assert_not_nil requests(:book_request).days
  end

  test "request days is 10" do
    assert_equal(requests(:book_request).days, 10)
  end

  test "request compare status" do
    assert_equal(requests(:book_request).status, 'pending')
  end

end
