require 'test_helper'

class ItemTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test "should not save without name" do
    item = Item.new
    assert_not item.save
  end

  test "should look up item" do
    assert items(:one)
  end

  test "should look up item 2" do
    assert items(:book)
  end

  test "should look up description" do
    assert_equal(items(:book).description, "Thick Book")
  end

  test "description should not match garbage data" do
    assert_not_equal(items(:book).description, "Garbage Description")
  end

  test "item should have a loan" do
    assert_not_nil(items(:book).loan)
  end

  test "item should not have an owner" do
    assert_nil items(:book).user_id
  end

  test "item has created at timestamp" do
    assert_not_nil items(:book).created_at
  end

  test "item has updated at timestamp" do
    assert_not_nil items(:book).updated_at
  end

  test "item has tags" do
    assert_equal(items(:book).tags, "#book")
  end
end
