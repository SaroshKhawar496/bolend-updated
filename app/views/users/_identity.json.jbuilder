# return only information to identify a user
json.extract! user, :id, :fname, :lname

# exclude contact info and other privileged data