import { ScrollView, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Terms() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-primary px-8 pt-20 pb-10">
      <Text className="text-3xl font-bold text-dark text-center mb-8">用戶使用同意條款暨免責聲明</Text>

      <Text className="text-base text-dark leading-relaxed mb-4">
        歡迎使用 CoBuy（以下簡稱本系統）。在您註冊帳號或使用本系統提供之服務前，請詳細閱讀並同意以下條款。若您使用本系統，即視為已閱讀、瞭解並同意本條款之所有內容。
      </Text>

      <Text className="text-base text-dark leading-relaxed mb-4">
        <Text className="font-bold">1. 系統功能定位：</Text> 本系統為宿舍學生提供團購媒合平台，協助同學發起與加入團購需求，以促進資源共享與成本分攤。惟本系統僅提供訊息媒合服務，不涉入金錢交易、實體交貨或商品品質等事宜。
      </Text>

      <Text className="text-base text-dark leading-relaxed mb-4">
        <Text className="font-bold">2. 金流與交貨處理：</Text> 目前版本（MVP）下，本系統不支援任何形式之線上支付或金流處理功能。所有金錢收付、商品交貨等交易行為，皆由訂單發起人（簡稱單主）與參與者（簡稱拼單者）自行協調與負責。請用戶務必謹慎確認雙方身分、交易細節與信任基礎，平台恕不介入任何交易糾紛之處理。
      </Text>

      <Text className="text-base text-dark leading-relaxed mb-4">
        <Text className="font-bold">3. 風險揭露與責任免除：</Text> 您理解並同意，若因使用本系統所產生之任何損失（例如：未收到商品、商品與描述不符、金錢糾紛、個資洩漏等），本系統與開發團隊不承擔任何法律或賠償責任。
      </Text>

      <Text className="text-base text-dark leading-relaxed mb-4">
        <Text className="font-bold">4. 使用者義務：</Text> 用戶應保證所提供之資訊正確無誤，不得冒用他人身分或散播不實訊息，亦不得利用本系統從事違法行為。違反者，將可能被停權或移送相關單位處理。
      </Text>

      <Text className="text-base text-dark leading-relaxed mb-8">
        <Text className="font-bold">5. 條款異動權：</Text> 本系統團隊保有隨時修改、更新本條款內容之權利，並將於系統公告處通知用戶。您若於條款變更後繼續使用本系統，即視為同意更新後之條款。
      </Text>

      <Pressable
        onPress={() => router.replace('/(auth)/register')}
        className="py-3 rounded-lg items-center shadow bg-secondary"
      >
        <Text className="text-primary text-lg font-bold">回到註冊頁</Text>
      </Pressable>
    </ScrollView>
  );
}
