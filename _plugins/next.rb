module Jekyll
  class NextTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
    	if @text.to_s == ''
    		@text = "Next"
    	end

    	@text = @text.strip! || @text if !@text.nil?
    	%{<a href="/javascript_required.html" onclick="nextPage(); return false;" class="btn btn-next">#{@text}</a>}
    end
  end
end

Liquid::Template.register_tag('next', Jekyll::NextTag)
