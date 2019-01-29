module Jekyll
  class ScalaBlock < Liquid::Block

    def render(context)
      text = super
      %{<pre><code class="lang-scala">#{text.strip}</code></pre>}
    end
  end
end

Liquid::Template.register_tag('scala', Jekyll::ScalaBlock)
