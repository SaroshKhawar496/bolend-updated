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

end
