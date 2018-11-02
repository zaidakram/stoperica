class League < ApplicationRecord
  has_many :races
  has_many :club_league_points
  enum league_type: [:xczld, :lead]
  before_validation :generate_slug

  def to_param
    name.parameterize
  end

  def generate_slug
    self.slug = name.parameterize
  end

  def racers
    categories = RaceResult
                 .includes(:category, racer: :club)
                 .where(race_id: races.ids)
                 .where.not(points: nil)
                 .group_by { |rr| rr.category.category }
    categories.each do |key, rrs|
      categories[key] = rrs.group_by(&:racer_id)
    end
  end
end
