Rails.application.routes.draw do
  resources :race_results
  resources :races
  resources :racers
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
