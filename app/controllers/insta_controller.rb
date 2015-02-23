class InstaController < ApplicationController

  before_action :initClient

  def getMedia
    next_max_id = params[:next_max_id]
    url_instagram_get_recent_media = URI.parse("https://api.instagram.com/v1/users/#{@user_id}/media/recent/?max_id=#{next_max_id}&client_id=#{@client_id}")
    http = Net::HTTP.new(url_instagram_get_recent_media.host, url_instagram_get_recent_media.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE 
    request_parse = Net::HTTP::Get.new(url_instagram_get_recent_media.request_uri)
    response = http.request(request_parse)
    if request.xhr?
      render :json => response.body
    else
      redirect_to :controller => 'page'
    end
  end  

  def getUser
    url_instagram_get_user = URI.parse("https://api.instagram.com/v1/users/#{@user_id}/?client_id=#{@client_id}")
    http = Net::HTTP.new(url_instagram_get_user.host, url_instagram_get_user.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE 
    request_parse = Net::HTTP::Get.new(url_instagram_get_user.request_uri)
    response = http.request(request_parse)
    if request.xhr?
      render :json => response.body
    else
      redirect_to :controller => 'page'
    end
  end

  def getMediaDetail
    id = params[:id]
    url_instagram_get_detail_media = URI.parse("https://api.instagram.com/v1/media/#{id}/?client_id=#{@client_id}")
    http = Net::HTTP.new(url_instagram_get_detail_media.host, url_instagram_get_detail_media.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE 
    request_parse = Net::HTTP::Get.new(url_instagram_get_detail_media.request_uri)
    response = http.request(request_parse)
    if request.xhr?
      render :json => response.body
    else
      redirect_to :controller => 'page'
    end
  end  

  private  
    def initClient
      @user_id = Settings.instagram.user_id 
      @client_id = Settings.instagram.client_id
    end  


end
