class PageController < ApplicationController
  layout "page"
  
  def index
    @media_id = params[:id]
  end

end
