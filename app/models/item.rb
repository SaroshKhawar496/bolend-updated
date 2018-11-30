class Item < ApplicationRecord
  # respond_to :json
  acts_as_punchable
	# NOTE: this query uses "ILIKE" for case insensitive matching. May not work with all RDBMS's!!
  scope :item_search, -> (search_item) { where("name ILIKE ? OR description ILIKE ?", "%#{search_item}%", "%#{search_item}%")}

  validates :name, presence: true
  belongs_to :user
  has_one_attached :image # one-to-one relationship

  has_many :requests, dependent: :destroy
  has_many :requesting_users, :through => :requests, :source => :user

  has_one :loan, dependent: :destroy
  has_one :borrower, :through => :loan, :source => :user

  #to be able to tag items
  include SimpleHashtag::Hashtaggable
  hashtaggable_attribute :tags

  #Searching
  # searchkick

  # def search_data
  # 	{
  # 		item_name: name,
  # 		item_detail: description
  # 	}


  # end

end
