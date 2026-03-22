"""크롤러 공통 인터페이스"""
from abc import ABC, abstractmethod
from typing import List
from ..models.filter import FilterCondition
from ..models.property import PropertyItem


class BaseCrawler(ABC):
    """모든 크롤러가 구현해야 하는 기본 인터페이스"""

    SOURCE: str = ""  # "naver" | "zigbang"

    @abstractmethod
    async def fetch(self, condition: FilterCondition) -> List[PropertyItem]:
        """
        주어진 필터 조건으로 매매 매물을 수집하여 반환.

        Args:
            condition: 검색 필터 조건

        Returns:
            PropertyItem 리스트
        """
        raise NotImplementedError

    def _log(self, msg: str) -> None:
        print(f"[{self.SOURCE}] {msg}")
