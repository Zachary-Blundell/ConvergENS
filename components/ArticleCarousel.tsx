import * as React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { CardArticleFlat } from '@/lib/cms/articles.types';
import ArticleCard from './ArticleCard';

export function ArticleCardCarousel({
  articles,
  className,
}: {
  articles: Array<CardArticleFlat>;
  className?: string;
}) {
  return (
    <Carousel
      // className="max-w-5/6 flex items-center"
      className={cn('flex items-center justify-center', className)}
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      {articles.length < 2 ? <></> : <CarouselPrevious />}
      <CarouselContent className="-ml-1">
        {articles.map((a) => (
          <CarouselItem key={a.id} className={articles.length < 3 ? "pl-1" : "pl-1 md:basis-1/2 lg:basis-1/3"}>
            <div className="p-1">
              <ArticleCard key={a.id} article={a} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {articles.length < 2 ? <></> : <CarouselNext />}
    </Carousel>
  );
}
