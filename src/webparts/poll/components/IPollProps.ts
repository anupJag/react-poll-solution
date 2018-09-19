export interface IPollProps {
  pollTitle: string;
  pollDataCollection: any[];
  pollDescription: string;
  pollResultType: string;
  updateContent: (value: string) => void;
  content: string;
  _onConfigure: () => void;
}


export interface IPollOption {
  option: string;
}
