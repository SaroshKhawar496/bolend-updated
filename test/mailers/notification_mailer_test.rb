require 'test_helper'

class NotificationMailerTest < ActionMailer::TestCase
  test "item_request_email" do
    mail = NotificationMailer.item_request_email
    assert_equal "Item request email", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
