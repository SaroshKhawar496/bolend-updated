json.user_notifications @notifications do |notification|
  json.notification_id notification.id
  json.sender notification.sender
  json.action notification.action
  json.notifiable_object_type notification.notifiable_object_type
  json.notifiable_object notification.notifiable_object
  # json.url polymorphic_url(notification.notifiable_object, :format => :json)
  json.created_at notification.created_at
  json.read_at notification.read_at
end

json.partial! "pagination/pagination", locals: {model: @notifications, per_page: @per_page}
