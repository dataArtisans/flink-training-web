module Jekyll
  class JavaBlock < Liquid::Block

    def render(context)
      text = super.strip.gsub('<', '&lt;').gsub('>', '&gt;')
    	%{<pre><code class="lang-java">#{text}</code></pre>}
    end
  end
end

Liquid::Template.register_tag('java', Jekyll::JavaBlock)
