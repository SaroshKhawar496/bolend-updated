class User < ApplicationRecord

	#adding validations on the input data
	validates :fname, presence: true, length: { minimum: 3, maximum: 25 } 
	validates :lname, presence: true, length: { minimum: 3, maximum: 25 }
	
	#breakdown the address into different fields, like apt, street, city etc later and validate them!!!
	validates :address, presence: true

	#reg expression for email format validity
	VALID_EMAIL_REGEX= /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i 

	#reg exp for phone number validity
	VALID_PHONE_REGEX= /\A(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\z/i

	#10 digit length restriction on phone number, assuming Canadian numbers only
	validates :phone, presence: true, length: {is: 10}, format: {with: VALID_PHONE_REGEX} 

	validates :email, presence: true, length: {maximum: 100}, uniqueness: { case_sensitive: false }, 
			  format: {with: VALID_EMAIL_REGEX}

	#gender validation
	validates :gender, presence: true, inclusion: %w(male female), uniqueness: { case_sensitive: false}

	validates :dateofbirth, presence: true
	
	#using custom fucntion to check 18+ age of user
	validate :validate_age

	private
	def validate_age
		if dateofbirth.present? && dateofbirth > 18.years.ago.to_date
			errors.add(:dateofbirth, 'You should be over 18 years old.')
		end

	end
	
end
