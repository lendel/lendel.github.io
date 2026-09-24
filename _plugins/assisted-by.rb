#!/usr/bin/env ruby
#
# "Assisted by" badges for posts written with AI assistants or virtual
# authors (see _data/assistants.yml).
#
# - Appends an "Assisted by" box with the badges to the end of every post that sets `assisted_by`.
# - Generates /assisted/<key>/ for each assistant, listing its posts.

Jekyll::Hooks.register :posts, :pre_render do |post|
  next unless post.data['assisted_by']

  post.content = "#{post.content}\n\n{% include assisted-by.html %}\n"
end

module AssistedBy
  class Generator < Jekyll::Generator
    safe true

    def generate(site)
      (site.data['assistants'] || {}).each do |key, assistant|
        posts = site.posts.docs
          .select { |post| Array(post.data['assisted_by']).include?(key) }
          .sort_by(&:date)
          .reverse

        page = Jekyll::PageWithoutAFile.new(site, site.source, "assisted/#{key}", 'index.html')
        page.data['layout'] = 'assisted'
        page.data['title'] = "Assisted by #{assistant['label'] || assistant['name']}"
        page.data['assistant'] = key
        page.data['posts'] = posts
        site.pages << page
      end
    end
  end
end
