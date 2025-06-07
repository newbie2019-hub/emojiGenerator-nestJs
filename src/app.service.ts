import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getEmoji(index?: number): string {
    const emojis = this.getEmojis();
    const randomIndex = Math.floor(Math.random() * emojis.length);

    return typeof index !== `undefined` ? emojis[index] : emojis[randomIndex];
  }

  getEmojis() {
    return ['🤣', '🤦🏼', '✨', '📈', '🐶', '☹️', '😇', '😡', '👨🏻‍🎓'];
  }
}
