require 'test_helper'

class NotificationMailerTest < ActionMailer::TestCase
  test "item_request_email" do
    recepient = User.new
    recepient.email = "to@example.org"
    recepient.fname = "Recepient"
    sender = User.new
    sender.fname = "sender"
    item = Item.new
    item.name = "Test Item"
    mail = NotificationMailer.item_request_email([recepient, sender, item])
    assert_equal "Your Item Has Been Requested", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["borrowland000@gmail.com"], mail.from
    assert_match "Hi", mail.body.encoded
    assert_match "has requested to borrow your", mail.body.encoded
    assert_match "See The Request", mail.body.encoded
    assert_match "Click on the link below to see:", mail.body.encoded
    assert_match "Test Item", mail.body.encoded
    assert_match "Sender", mail.body.encoded
    assert_match "Recepient", mail.body.encoded
  end

end
