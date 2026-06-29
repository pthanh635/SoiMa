import { emptyNightActions } from './rooms.js';

function roleMeta(key, labelVi, labelEn, faction, aura, group, isImplemented, isNightRole, description, shortDescription) {
  return { key, labelVi, labelEn, faction, team: faction, aura, group, isImplemented, isNightRole, description, shortDescription };
}

export const ROLE_META = {
  villager: roleMeta('villager', 'Dân làng', 'Villager', 'village', 'Thiện', 'Dân thường', true, false, 'Nhân vật cơ bản nhất, không có khả năng đặc biệt ngoài việc quan sát, suy luận và thảo luận ban ngày để tìm ra Ma Sói. Đây là lực lượng đông đảo nhất trong game.', 'Không có kỹ năng, dùng suy luận và biểu quyết để tìm Sói.'),
  guard: roleMeta('guard', 'Bảo vệ', 'Guard', 'village', 'Thiện', 'Dân thường', true, true, 'Mỗi đêm được chọn một người để bảo vệ. Nếu người đó bị Sói cắn thì sẽ thoát chết. Tùy luật, Bảo vệ có thể không được bảo vệ cùng một người trong hai đêm liên tiếp.', 'Mỗi đêm bảo vệ một người khỏi bị Sói cắn.'),
  night_watchman: roleMeta('night_watchman', 'Người gác đêm', 'Night Watchman', 'village', 'Thiện', 'Dân thường nâng cao', false, true, 'Biết ai đang được bảo vệ. Có khả năng chặn một cuộc tấn công của Sói tối đa vài lần trong game. Vai trò thiên về phòng thủ, giúp phe Dân kéo dài thời gian suy luận.', 'Vai phòng thủ nâng cao, chưa triển khai.'),
  butcher: roleMeta('butcher', 'Đồ tể', 'Butcher', 'village', 'Thiện', 'Dân thường nâng cao', false, true, 'Sở hữu một số lượt cứu hạn chế, có thể dùng để cứu nhiều người trong một đêm tùy luật. Đây là dạng bảo vệ nâng cao nhưng số lần hành động có giới hạn.', 'Bảo vệ nâng cao có số lượt cứu giới hạn, chưa triển khai.'),
  monk: roleMeta('monk', 'Thầy tu', 'Monk', 'village', 'Thiện', 'Dân thường', false, true, 'Mỗi đêm có thể ban phước và bảo vệ một người, giúp họ không bị Sói tấn công hoặc tránh một số năng lực đặc biệt khác. Một số bản chơi cho phép Thầy tu tự bảo vệ.', 'Ban phước bảo vệ người chơi, chưa triển khai.'),
  hunter: roleMeta('hunter', 'Thợ săn', 'Hunter', 'village', 'Thiện', 'Dân thường', true, false, 'Nếu bị Sói giết hoặc bị treo cổ, Thợ săn có quyền chọn bắn chết một người đi cùng mình. Đây là vai trò tạo sự cân bằng, khiến Sói phải dè chừng khi tấn công.', 'Khi chết có thể bắn chết một người khác.'),
  seer: roleMeta('seer', 'Tiên tri', 'Seer', 'village', 'Thiện', 'Dân mạnh', true, true, 'Mỗi đêm được quyền soi một người để biết họ thuộc phe Sói hay không. Đây là nhân vật quan trọng nhất của phe Dân, giúp định hướng nghi ngờ và bảo vệ dân thường.', 'Mỗi đêm soi một người để biết phe.'),
  medium: roleMeta('medium', 'Thầy đồng', 'Medium', 'village', 'Không rõ', 'Dân mạnh', false, true, 'Có thể giao tiếp với người chết và đôi khi hồi sinh một dân làng. Nếu hồi sinh trúng Sói thì có thể gây bất lợi cho phe Dân. Vai trò này có tính rủi ro cao.', 'Giao tiếp/hồi sinh người chết tùy luật, chưa triển khai.'),
  jailer: roleMeta('jailer', 'Giám ngục', 'Jailer', 'village', 'Không rõ', 'Dân mạnh nâng cao', false, true, 'Có khả năng giam giữ người chơi để nghe họ nói chuyện hoặc vô hiệu hóa khả năng của họ. Ngoài ra còn có thể đưa vũ khí để các người chơi này bắn nhau. Vai trò khó đoán, đôi khi lợi hoặc hại tùy tình huống.', 'Giam giữ/vô hiệu hóa người chơi, chưa triển khai.'),
  avenger: roleMeta('avenger', 'Kẻ báo thù', 'Avenger', 'village', 'Không rõ', 'Dân mạnh nâng cao', false, false, 'Nếu bị giết, có thể kéo theo một người khác cùng chết. Mang tính chất hi sinh, giúp phe Dân có cơ hội hạ được Sói ngay cả khi mình bị loại.', 'Khi chết có thể kéo theo người khác, chưa triển khai.'),
  fool: roleMeta('fool', 'Chàng ngốc', 'Fool', 'village', 'Không rõ', 'Không phân loại', false, false, 'Khi bị treo cổ sẽ không chết, nhưng mất quyền biểu quyết. Vẫn có thể tham gia thảo luận. Vai trò này dễ gây nhiễu, khiến phe Dân nhầm lẫn.', 'Không chết khi bị treo nhưng mất quyền vote, chưa triển khai.'),
  dancer: roleMeta('dancer', 'Người vũ công', 'Dancer', 'village', 'Không rõ', 'Không phân loại', false, true, 'Mỗi đêm có thể nhảy múa để thu hút sự chú ý, qua đó làm gián đoạn hành động của Sói hoặc một vài vai trò khác. Vai trò này ít phổ biến và mang tính phụ trợ.', 'Gây gián đoạn hành động ban đêm, chưa triển khai.'),
  maid: roleMeta('maid', 'Người hầu gái', 'Maid', 'village', 'Không rõ', 'Không phân loại', false, false, 'Thường bảo vệ hoặc phục vụ cho một nhân vật quan trọng như Tiên tri hoặc Thầy tu. Khi nhân vật đó chết, hầu gái sẽ mất chức năng.', 'Hỗ trợ một vai quan trọng, chưa triển khai.'),
  robber: roleMeta('robber', 'Kẻ cướp', 'Robber', 'village', 'Không rõ', 'Không phân loại', false, true, 'Có thể cướp quyền năng hoặc vật phẩm của người khác. Nếu cướp trúng Sói có thể lật kèo, nhưng nếu cướp nhầm phe Dân thì có thể gây hại.', 'Cướp kỹ năng/vật phẩm của người khác, chưa triển khai.'),
  drunk: roleMeta('drunk', 'Kẻ say rượu', 'Drunk', 'village', 'Không rõ', 'Không phân loại', false, false, 'Một vai trò đặc biệt, thường gây ra sự hỗn loạn. Có thể nhầm lẫn về hành động của mình, bị quản trò thông báo sai hoặc bị hạn chế khả năng trong vài lượt đầu.', 'Vai gây nhiễu và hỗn loạn, chưa triển khai.'),
  werewolf: roleMeta('werewolf', 'Ma Sói thường', 'Werewolf', 'werewolf', 'Ác', 'Sói cơ bản', true, true, 'Ban đêm cùng đồng bọn chọn một người để giết. Ban ngày giả dạng dân làng và tìm cách thuyết phục, đánh lạc hướng Tiên tri và phe Dân. Đây là lực lượng chính của phe Sói.', 'Ban đêm cùng Sói chọn người để cắn.'),
  alpha_wolf: roleMeta('alpha_wolf', 'Sói đầu đàn', 'Alpha Wolf', 'werewolf', 'Ác', 'Sói đặc biệt', false, true, 'Có quyền quyết định cuối cùng khi phe Sói phân vân về mục tiêu tấn công. Sói đầu đàn thường được Quản trò gọi dậy trước để các Sói khác nhận biết.', 'Sói có quyền quyết định cuối cùng, chưa triển khai.'),
  wolf_child: roleMeta('wolf_child', 'Sói con', 'Wolf Child', 'werewolf', 'Ác', 'Sói đặc biệt', false, true, 'Khi bị giết, đêm tiếp theo Sói sẽ được cắn hai người thay vì một. Đây là vai trò tạo sự kịch tính, khiến phe Dân phải dè chừng khi xử tử nhầm.', 'Khi chết làm Sói được cắn mạnh hơn, chưa triển khai.'),
  cursed_wolf: roleMeta('cursed_wolf', 'Sói nguyền / Kẻ bị nguyền', 'Cursed Wolf', 'werewolf', 'Ác', 'Sói biến thể', false, true, 'Ban đầu mang danh nghĩa dân làng, nhưng nếu bị Sói cắn sẽ lập tức trở thành Ma Sói và gia nhập phe Sói. Đây là vai trò hai mặt, dễ gây rối loạn niềm tin trong phe Dân.', 'Bị Sói cắn sẽ biến thành Sói, chưa triển khai.'),
  wolf_witch: roleMeta('wolf_witch', 'Sói phù thủy', 'Wolf Witch', 'werewolf', 'Ác', 'Sói nâng cao', false, true, 'Ngoài khả năng cắn cùng Sói, còn có thể sử dụng ma thuật để gây nhiễu, ví dụ làm người khác mất khả năng trong một đêm.', 'Sói có phép gây nhiễu ban đêm, chưa triển khai.'),
  wolf_converter: roleMeta('wolf_converter', 'Sói hóa sói', 'Wolf Converter', 'werewolf', 'Ác', 'Sói nâng cao', false, true, 'Có thể hóa sói một dân làng khác để biến họ thành đồng minh. Vai trò này rất mạnh nếu xuất hiện trong nhóm đông người.', 'Có thể biến người khác thành Sói, chưa triển khai.'),
  wolf_medium: roleMeta('wolf_medium', 'Sói thầy đồng', 'Wolf Medium', 'werewolf', 'Ác', 'Sói nâng cao', false, true, 'Có khả năng giao tiếp với người chết và kiểm soát thông tin sai lệch, khiến phe Dân dễ bị nhầm lẫn.', 'Sói thao túng thông tin người chết, chưa triển khai.'),
  silent_wolf: roleMeta('silent_wolf', 'Sói câm lặng', 'Silent Wolf', 'werewolf', 'Ác', 'Sói đặc biệt', false, true, 'Vẫn đi săn cùng Sói bình thường, nhưng ban ngày không được nói hoặc chỉ nói hạn chế. Thường dùng để tăng tính thử thách và làm trò chơi kịch tính hơn.', 'Sói bị hạn chế nói ban ngày, chưa triển khai.'),
  hidden_wolf: roleMeta('hidden_wolf', 'Sói ẩn mình', 'Hidden Wolf', 'werewolf', 'Ác', 'Sói đặc biệt', false, true, 'Có khả năng tránh bị soi bởi Tiên tri trong một số lượt. Đây là nhân vật tàng hình giúp phe Sói tồn tại lâu hơn.', 'Khó bị Tiên tri phát hiện, chưa triển khai.'),
  cursed_magic_wolf: roleMeta('cursed_magic_wolf', 'Sói nguyền rủa', 'Cursed Magic Wolf', 'werewolf', 'Ác', 'Sói nâng cao', false, true, 'Có thể gieo lời nguyền khiến một vai trò phe Dân mất khả năng hoạt động. Thường được thêm vào khi chơi đông để cân bằng.', 'Gieo lời nguyền làm phe Dân mất kỹ năng, chưa triển khai.'),
  cupid: roleMeta('cupid', 'Cupid / Thần Tình Yêu', 'Cupid', 'solo', 'Trung lập', 'Solo tạo liên minh', false, true, 'Ngay đêm đầu tiên, Cupid chọn hai người chơi trở thành cặp đôi yêu nhau. Từ đó, nếu một trong hai người chết thì người còn lại cũng sẽ chết theo. Nếu cặp đôi thuộc hai phe khác nhau, họ có thể trở thành một phe riêng và thắng khi cả hai là những người sống sót cuối cùng.', 'Ghép cặp hai người yêu nhau trong đêm đầu, chưa triển khai đầy đủ.'),
  witch: roleMeta('witch', 'Phù thủy', 'Witch', 'village', 'Trung lập', 'Solo cân bằng', true, true, 'Có hai bình thuốc: một bình cứu người bị Sói cắn và một bình giết một người bất kỳ. Có thể dùng cả hai trong cùng một đêm hoặc để dành. Đây là vai trò rất mạnh, vừa giúp phe Dân vừa có thể gây bất ngờ cho phe Sói.', 'Có một bình cứu và một bình độc.'),
  piper: roleMeta('piper', 'Kẻ thổi sáo', 'Piper', 'solo', 'Trung lập', 'Solo khống chế', false, true, 'Mỗi đêm được chọn hai người để ru ngủ hoặc mê hoặc. Khi tất cả người chơi còn sống đều bị mê hoặc, Kẻ thổi sáo lập tức thắng. Đây là vai trò khó chơi nhưng rất thú vị khi kéo dài trận.', 'Mê hoặc người chơi để đạt điều kiện thắng riêng, chưa triển khai.'),
  thief: roleMeta('thief', 'Kẻ ăn trộm', 'Thief', 'solo', 'Trung lập', 'Solo thay vai', false, true, 'Ban đầu nhận hai lá bài úp của những người không tham gia. Trước khi game bắt đầu, Kẻ ăn trộm phải chọn một trong hai lá để hóa thân thành vai trò đó. Tùy chọn bài mà có thể thành Dân, Sói hoặc một vai Solo khác.', 'Chọn một trong hai lá bài úp để đổi vai, chưa triển khai.'),
  elder: roleMeta('elder', 'Già làng', 'Elder', 'solo', 'Trung lập', 'Solo trụ cột', false, false, 'Sở hữu khả năng đặc biệt: cần bị giết hai lần mới chết, trừ khi bị Sói cắn cộng với trúng thuốc độc của Phù thủy trong cùng một đêm. Già làng giúp tăng độ bền cho phe Dân, nhưng cũng có thể khiến phe Sói nản.', 'Cần bị giết hai lần mới chết, chưa triển khai.'),
  white_wolf: roleMeta('white_wolf', 'Người sói trắng', 'White Wolf', 'solo', 'Ác', 'Solo phản bội', false, true, 'Mỗi đêm cùng dậy với Sói, nhưng cách đêm lại được quyền giết thêm một Sói khác. Người Sói trắng chiến thắng khi là người sống sót cuối cùng. Đây là vai phản bội nguy hiểm, vừa giả dạng đồng minh, vừa ngấm ngầm triệt hạ cả hai phe.', 'Sói phản bội có mục tiêu thắng riêng, chưa triển khai.'),
  shapeshifter_wolf: roleMeta('shapeshifter_wolf', 'Người sói hóa hình', 'Shapeshifter Wolf', 'solo', 'Trung lập', 'Solo đặc biệt', false, true, 'Có thể giả dạng một người chết bất kỳ để đánh lạc hướng phe Dân. Nếu chơi bản nâng cao, có thể cướp thân phận và thay thế hoàn toàn người đã chết.', 'Giả dạng hoặc cướp thân phận người chết, chưa triển khai.'),
  dreamer: roleMeta('dreamer', 'Kẻ báo mộng', 'Dreamer', 'solo', 'Trung lập', 'Solo huyền bí', false, true, 'Mỗi đêm có thể gieo một giấc mơ vào người chơi, khiến họ hành động nhầm lẫn vào ngày hôm sau. Đây là vai ít phổ biến nhưng mang tính giải trí cao.', 'Gieo giấc mơ gây nhầm lẫn, chưa triển khai.'),
  lovers: roleMeta('lovers', 'Cặp đôi', 'Lovers', 'lovers', 'Trung lập', 'Trạng thái đặc biệt', false, false, 'Cặp đôi không phải là một vai trò cụ thể, mà là trạng thái đặc biệt được tạo ra bởi Cupid trong đêm đầu tiên. Nếu một người trong cặp chết, người còn lại cũng chết theo.', 'Trạng thái đặc biệt do Cupid tạo ra, chưa triển khai đầy đủ.'),
  lovers_same_side: roleMeta('lovers_same_side', 'Cặp đôi cùng phe', 'Same-side Lovers', 'lovers', 'Trung lập', 'Trạng thái đặc biệt', false, false, 'Hai người cùng phe chia sẻ số phận. Nếu một người chết, người còn lại cũng chết ngay lập tức. Họ thắng cùng phe gốc của họ.', 'Cặp đôi cùng phe, chết kéo theo nhau, chưa triển khai.'),
  lovers_cross_side: roleMeta('lovers_cross_side', 'Cặp đôi khác phe', 'Cross-side Lovers', 'lovers', 'Trung lập', 'Trạng thái đặc biệt', false, false, 'Nếu cặp đôi thuộc hai phe khác nhau như Dân và Sói, họ có thể lập tức tách ra thành một phe riêng. Họ phải tìm cách sống sót đến cuối cùng, bất chấp cả phe Dân lẫn phe Sói.', 'Cặp đôi khác phe có thể thành phe riêng, chưa triển khai.'),
  random_regular_villager: roleMeta('random_regular_villager', 'Dân Làng Thường Ngẫu Nhiên', 'Random Regular Villager', 'random', 'Không rõ', 'Không phân loại / Đặc biệt', false, false, 'Khi chọn vai này, người chơi sẽ được hệ thống hoặc Quản trò random một chức năng trong số các vai dân thường như Bà Gia Khó Tính, Bác Sĩ, Bảo Vệ, Cảnh Sát Trưởng, Cậu Bé Miệng Bự, Dân Làng, Hoa Bé Con, Kẻ Báo Thù, Kỹ Nữ, Lực Sĩ, Mục Sư, Người Yêu Hòa Bình, Nhà Ngoại Cảm, Ông Già Noel, Phù Thủy, Thầy Bói, Thị Trưởng, Thiện Xạ, Thợ Săn Quái Thú hoặc Tiên Tri Tập Sự.', 'Random một vai dân thường, chưa triển khai.'),
  random_strong_villager: roleMeta('random_strong_villager', 'Dân Làng Mạnh Ngẫu Nhiên', 'Random Strong Villager', 'random', 'Không rõ', 'Không phân loại / Đặc biệt', false, false, 'Người chơi sẽ được random một vai trò mạnh trong phe Dân như Người Khai Mệnh, Quản Ngục, Thám Tử, Thầy Đồng, Thợ Rèn, Tiên Tri hoặc Xạ Thủ.', 'Random một vai mạnh phe Dân, chưa triển khai.'),
  random_werewolf: roleMeta('random_werewolf', 'Ma Sói Ngẫu Nhiên', 'Random Werewolf', 'random', 'Không rõ', 'Không phân loại / Đặc biệt', false, true, 'Người chơi sẽ được random một trong các dạng Ma Sói như Ma Sói thường, Sói Ác Mộng, Sói Đầu Đàn, Sói Điên Cuồng, Sói Hắc Ám, Sói Hòa Bình, Sói Hộ Vệ, Sói Mèo Con, Sói Pháp Sư, Sói Tiên Tri hoặc Sói Trẻ.', 'Random một biến thể Ma Sói, chưa triển khai.'),
  random_vote: roleMeta('random_vote', 'Bỏ Phiếu Ngẫu Nhiên', 'Random Vote', 'random', 'Không rõ', 'Không phân loại / Đặc biệt', false, false, 'Người chơi được chọn sẽ trở thành Thợ Săn Người hoặc Thằng Ngố một cách ngẫu nhiên. Đây là một biến thể khiến ván chơi khó lường ngay từ đầu.', 'Random vai liên quan biểu quyết, chưa triển khai.'),
  random_killer: roleMeta('random_killer', 'Kẻ Giết Người Ngẫu Nhiên', 'Random Killer', 'random', 'Không rõ', 'Không phân loại / Đặc biệt', false, true, 'Random một trong các vai sát thủ mạnh thuộc phe Solo như Côn Đồ, Giáo Chủ, Kẻ Ăn Thịt Người, Kẻ Đặt Bom, Kẻ Phóng Hỏa, Sát Nhân Ảnh Thuật, Sát Nhân Hàng Loạt, Tin Tặc hoặc Xác Sống.', 'Random một vai sát thủ phe riêng, chưa triển khai.'),
  random_any: roleMeta('random_any', 'Ngẫu Nhiên', 'Random Any', 'random', 'Không rõ', 'Không phân loại / Đặc biệt', false, false, 'Hệ thống sẽ random một vai trò bất kỳ trong toàn bộ danh sách Ma Sói. Dùng để tăng độ bất ngờ, nhưng chỉ nên dùng khi game đã hỗ trợ nhiều vai.', 'Random một vai bất kỳ, chưa triển khai.'),
  traitor: roleMeta('traitor', 'Phản bội', 'Traitor', 'special', 'Không rõ', 'Không phân loại', false, false, 'Vai đặc biệt đứng về phía đối nghịch với phe Dân. Gameplay chi tiết chưa được triển khai trong phiên bản hiện tại.', 'Vai đặc biệt chưa triển khai.')
};

export const ROLE_LABEL = Object.fromEntries(Object.entries(ROLE_META).map(([role, meta]) => [role, meta.labelVi]));

export const TEAM_LABEL = {
  village: 'Phe dân làng',
  werewolf: 'Phe ma sói'
};

export const NIGHT_STAGES = [
  { key: 'wolf_special', labelVi: 'Sói đặc biệt', roles: ['wolf_child', 'alpha_wolf'], moderatorPrompt: 'Gọi các vai Sói đặc biệt trước. Chưa triển khai vai này.', playerPrompt: 'Chờ Quản trò điều phối.', isImplemented: false, canSkipIfNoRole: true },
  { key: 'werewolf', labelVi: 'Sói', roles: ['werewolf'], moderatorPrompt: 'Gọi Sói thức dậy và chọn một người để cắn.', playerPrompt: 'Chọn một người để cắn.', isImplemented: true, canSkipIfNoRole: true },
  { key: 'guard', labelVi: 'Bảo vệ', roles: ['guard'], moderatorPrompt: 'Gọi Bảo vệ thức dậy và chọn một người để bảo vệ.', playerPrompt: 'Chọn một người để bảo vệ.', isImplemented: true, canSkipIfNoRole: true },
  { key: 'witch', labelVi: 'Phù thủy', roles: ['witch'], moderatorPrompt: 'Gọi Phù thủy thức dậy. Nếu có người bị cắn, thông báo riêng cho Phù thủy.', playerPrompt: 'Cân nhắc dùng bình cứu hoặc bình độc.', isImplemented: true, canSkipIfNoRole: true },
  { key: 'cursed', labelVi: 'Kẻ bị nguyền', roles: ['cursed_wolf'], moderatorPrompt: 'Vai này chưa triển khai, có thể bỏ qua.', playerPrompt: 'Chờ Quản trò điều phối.', isImplemented: false, canSkipIfNoRole: true },
  { key: 'seer', labelVi: 'Tiên tri', roles: ['seer'], moderatorPrompt: 'Gọi Tiên tri thức dậy và chọn một người để soi.', playerPrompt: 'Chọn một người để soi phe.', isImplemented: true, canSkipIfNoRole: true },
  { key: 'other_roles', labelVi: 'Các chức năng khác', roles: [], moderatorPrompt: 'Vai này chưa triển khai, có thể bỏ qua.', playerPrompt: 'Chờ Quản trò điều phối.', isImplemented: false, canSkipIfNoRole: true },
  { key: 'cupid', labelVi: 'Thần Tình yêu', roles: ['cupid'], moderatorPrompt: 'Thiết lập Cupid chỉ dành cho đêm đầu. Chưa triển khai vai này.', playerPrompt: 'Chờ Quản trò điều phối.', isImplemented: false, canSkipIfNoRole: true, firstNightOnly: true },
  { key: 'lovers_meet', labelVi: 'Đôi tình nhân gặp nhau', roles: [], moderatorPrompt: 'Gọi đôi tình nhân thức dậy. Chưa triển khai liên kết tình nhân.', playerPrompt: 'Chờ Quản trò điều phối.', isImplemented: false, canSkipIfNoRole: true, firstNightOnly: true }
];

export const NIGHT_ROLE_ORDER = NIGHT_STAGES.map(stage => stage.key);
export const BLANK_VOTE = '**blank**';

export function getStageByKey(key) {
  return NIGHT_STAGES.find(stage => stage.key === key) || null;
}

export function buildActiveNightStagesFromAssignedRoles(players, assignedRoleDeck = []) {
  const assignedRoles = new Set(assignedRoleDeck.length ? assignedRoleDeck : players.map(player => player.role).filter(Boolean));
  return NIGHT_STAGES
    .filter(stage => stage.roles.length > 0 && stage.roles.some(role => assignedRoles.has(role)))
    .map(stage => stage.key);
}

const ROLE_PRESETS = {
  8: { seer: 1, guard: 1, werewolf: 2, villager: 4 },
  9: { seer: 1, guard: 1, werewolf: 2, villager: 5 },
  10: { seer: 1, guard: 1, hunter: 1, werewolf: 3, villager: 4 },
  11: { seer: 1, guard: 1, hunter: 1, werewolf: 3, villager: 5 },
  12: { seer: 1, guard: 1, hunter: 1, cupid: 1, werewolf: 3, villager: 5 },
  13: { seer: 1, guard: 1, hunter: 1, cupid: 1, werewolf: 3, villager: 6 },
  14: { seer: 1, guard: 1, hunter: 1, cupid: 1, witch: 1, werewolf: 3, villager: 5, traitor: 1 },
  15: { seer: 1, guard: 1, hunter: 1, cupid: 1, witch: 1, werewolf: 4, villager: 6 },
  16: { seer: 1, guard: 1, hunter: 1, cupid: 1, witch: 1, elder: 1, werewolf: 4, villager: 6 },
  '17A': { seer: 1, guard: 1, hunter: 1, cupid: 1, witch: 1, elder: 1, piper: 1, werewolf: 4, villager: 6 },
  '17B': { seer: 1, guard: 1, hunter: 1, cupid: 1, witch: 1, elder: 1, piper: 1, thief: 1, werewolf: 4, villager: 5 },
  18: { seer: 1, guard: 1, hunter: 1, cupid: 1, witch: 1, elder: 1, piper: 1, thief: 1, werewolf: 4, villager: 6 }
};

export function getSuggestedRolePreset(playerCount, variant = 'A') {
  const count = Math.max(0, Math.floor(Number(playerCount) || 0));
  if (count < 8) {
    const preset = { werewolf: count > 1 ? 1 : 0 };
    if (count >= 5) preset.seer = 1;
    if (count >= 6) preset.guard = 1;
    preset.villager = Math.max(0, count - Object.values(preset).reduce((sum, value) => sum + value, 0));
    return preset;
  }
  if (count === 17) return { ...ROLE_PRESETS[`17${variant === 'B' ? 'B' : 'A'}`] };
  if (count > 18) return { ...ROLE_PRESETS[18], villager: ROLE_PRESETS[18].villager + count - 18 };
  return { ...(ROLE_PRESETS[count] || ROLE_PRESETS[8]) };
}

export function startGame(room) {
  if (room.status !== 'waiting') throw new Error('Game đã bắt đầu.');
  if (room.players.length < 4) throw new Error('Cần ít nhất 4 người chơi.');

  const roles = buildRoleDeck(room.players.length);
  room.assignedRoleCounts = countRoles(roles);
  room.activeNightStages = buildActiveNightStagesFromAssignedRoles(room.players, roles);
  shuffle(roles);

  room.players.forEach((player, index) => {
    player.role = roles[index];
    player.team = ROLE_META[player.role]?.team || 'village';
    player.alive = true;
    player.hasUsedHunterShot = false;
    player.witchPotions = player.role === 'witch'
      ? { heal: true, poison: true }
      : null;
  });

  room.status = 'playing';
  room.round = 1;
  room.votes = {};
  room.chat = [];
  beginNight(room, 'Đêm đầu tiên bắt đầu.');
}

export function doNightAction(room, actorId, targetId, action) {
  ensurePhase(room, 'night');
  const actor = findAlivePlayer(room, actorId);

  const stage = currentStage(room);
  if (!stage) throw new Error('Đêm đã xử lý xong.');
  if (!stage.isImplemented || !stage.roles.includes(actor.role)) {
    throw new Error(`Chưa tới lượt ${ROLE_LABEL[actor.role] || 'vai của bạn'}. Hiện tại Quản trò đang gọi ${stage.labelVi}.`);
  }

  if (actor.role === 'witch') {
    return doWitchAction(room, actor, targetId, action);
  }

  if (room.nightActions.acted[actor.role]) {
    throw new Error(`${ROLE_LABEL[actor.role]} đã hành động trong đêm này rồi.`);
  }

  const target = findAlivePlayer(room, targetId);

  if (actor.role === 'werewolf') {
    if (target.team === 'werewolf') throw new Error('Ma sói không nên tự cắn phe ma sói.');
    room.nightActions.werewolfTarget = target.id;
    room.nightActions.acted[actor.role] = true;
    completeCurrentStage(room);
    return { type: 'werewolf', message: `Ma sói đã chọn cắn ${target.name}.` };
  }

  if (actor.role === 'guard') {
    room.nightActions.guardTarget = target.id;
    room.nightActions.acted[actor.role] = true;
    completeCurrentStage(room);
    return { type: 'guard', message: `Đã bảo vệ ${target.name}.` };
  }

  if (actor.role === 'seer') {
    room.nightActions.seerTarget = target.id;
    room.nightActions.acted[actor.role] = true;
    completeCurrentStage(room);
    return {
      type: 'seer',
      message: `${target.name} thuộc ${TEAM_LABEL[target.team]}.`
    };
  }

  throw new Error('Vai của bạn không có hành động ban đêm.');
}

export function skipNightTurn(room, actorId) {
  ensurePhase(room, 'night');
  if (!room.currentNightStage) throw new Error('Không có lượt đêm để bỏ qua.');

  const actor = room.players.find(p => p.id === actorId);
  const stage = currentStage(room);
  const isCurrentRole = actor?.alive && stage?.roles.includes(actor.role);

  if (!isCurrentRole) {
    throw new Error('Chỉ người chơi đang tới lượt mới được bỏ qua lượt hiện tại.');
  }

  completeCurrentStage(room);
  return { type: 'skip', message: `Đã hoàn tất lượt ${stage.labelVi}.` };
}

export function moderatorNextStage(room, actorId) {
  ensureModerator(room, actorId);
  ensurePhase(room, 'night');
  if (!currentStage(room)) throw new Error('Không còn lượt đêm nào.');
  completeCurrentStage(room);
  return moveToNextStage(room);
}

export function moderatorSkipStage(room, actorId) {
  ensureModerator(room, actorId);
  ensurePhase(room, 'night');
  const stage = currentStage(room);
  if (!stage) throw new Error('Không còn lượt đêm nào.');
  completeCurrentStage(room);
  const result = moveToNextStage(room);
  return { ...result, message: `Đã bỏ qua ${stage.labelVi}.` };
}

export function moderatorEndNight(room, actorId) {
  ensureModerator(room, actorId);
  ensurePhase(room, 'night');
  if (room.currentNightStageIndex !== room.activeNightStages.length - 1) {
    throw new Error('Hãy hoàn tất hoặc bỏ qua các lượt trước khi kết thúc đêm.');
  }
  completeCurrentStage(room);
  return endNight(room);
}

function doWitchAction(room, actor, targetId, action) {
  if (!['heal', 'poison'].includes(action)) {
    throw new Error('Phù thủy hãy chọn dùng bình cứu hoặc bình độc.');
  }

  if (!actor.witchPotions?.[action]) {
    throw new Error(action === 'heal' ? 'Bình cứu đã được dùng.' : 'Bình độc đã được dùng.');
  }

  if (action === 'heal') {
    const wolfTargetId = getEffectiveWolfVictim(room)?.id;
    if (!wolfTargetId) throw new Error('Đêm nay không có ai đang chết vì Ma sói.');
    const target = findAlivePlayer(room, wolfTargetId);
    if (room.nightActions.witchPoisonTarget === target.id) {
      throw new Error('Không thể vừa cứu vừa độc cùng một người trong một đêm.');
    }

    room.nightActions.witchHealTarget = target.id;
    actor.witchPotions.heal = false;
    if (!canWitchStillAct(actor)) completeCurrentStage(room);
    return { type: 'witch', message: `Đã dùng bình cứu cho ${target.name}.` };
  }

  const target = findAlivePlayer(room, targetId);
  if (target.id === actor.id) throw new Error('Phù thủy không thể tự dùng bình độc.');
  if (room.nightActions.witchHealTarget === target.id) {
    throw new Error('Không thể vừa cứu vừa độc cùng một người trong một đêm.');
  }

  room.nightActions.witchPoisonTarget = target.id;
  actor.witchPotions.poison = false;
  if (!canWitchStillAct(actor)) completeCurrentStage(room);
  return { type: 'witch', message: `Đã dùng bình độc lên ${target.name}.` };
}

export function endNight(room) {
  ensurePhase(room, 'night');

  const wolfTargetId = room.nightActions.werewolfTarget;
  const guardTargetId = room.nightActions.guardTarget;
  const healTargetId = room.nightActions.witchHealTarget;
  const poisonTargetId = room.nightActions.witchPoisonTarget;
  const deaths = new Set();

  if (!wolfTargetId) {
    room.resultMessage = 'Đêm qua không có ai bị ma sói cắn.';
  } else if (wolfTargetId === guardTargetId || wolfTargetId === healTargetId) {
    room.resultMessage = 'Không ai chết vì Ma sói trong đêm qua.';
  } else {
    const victim = room.players.find(p => p.id === wolfTargetId && p.alive);
    if (victim) deaths.add(victim.id);
  }

  if (poisonTargetId) deaths.add(poisonTargetId);

  const victims = room.players.filter(p => deaths.has(p.id) && p.alive);
  victims.forEach(player => { player.alive = false; });

  if (victims.length > 0) {
    room.resultMessage = `Sáng nay, ${victims.map(p => p.name).join(' và ')} đã chết.`;
  }

  room.currentNightStage = null;
  room.currentNightStageIndex = -1;
  room.completedNightStages = [];
  room.nightTurn = null;
  room.nightTurnIndex = -1;
  room.nightActions = emptyNightActions();
  room.votes = {};

  const deadHunter = victims.find(player => player.role === 'hunter' && !player.hasUsedHunterShot);
  if (deadHunter) {
    const killedByWolves = wolfTargetId === deadHunter.id && wolfTargetId !== guardTargetId && wolfTargetId !== healTargetId;
    const cause = poisonTargetId === deadHunter.id && !killedByWolves ? 'poison' : 'night';
    if (queueHunterShot(room, deadHunter, cause, 'day')) return;
  }

  const winner = checkWin(room.players);
  if (winner) return finishGame(room, winner);

  room.phase = 'day';
}

export function goVoting(room) {
  ensurePhase(room, 'day');
  room.phase = 'voting';
  room.votes = {};
  room.resultMessage = 'Bắt đầu bỏ phiếu treo cổ.';
}

export function votePlayer(room, voterId, targetId) {
  ensurePhase(room, 'voting');
  findAlivePlayer(room, voterId);
  if (targetId !== BLANK_VOTE) findAlivePlayer(room, targetId);
  room.votes[voterId] = targetId;
  room.resultMessage = 'Đã ghi nhận phiếu vote.';
}

export function endVote(room) {
  ensurePhase(room, 'voting');

  const aliveIds = new Set(room.players.filter(p => p.alive).map(p => p.id));
  const count = {};

  for (const [voterId, targetId] of Object.entries(room.votes)) {
    if (!aliveIds.has(voterId) || (targetId !== BLANK_VOTE && !aliveIds.has(targetId))) continue;
    count[targetId] = (count[targetId] || 0) + 1;
  }

  const entries = Object.entries(count).sort((a, b) => b[1] - a[1]);

  let eliminated = null;
  if (entries.length === 0) {
    room.resultMessage = 'Không có ai bị treo cổ vì chưa có phiếu hợp lệ.';
  } else if (entries.length > 1 && entries[0][1] === entries[1][1]) {
    room.resultMessage = 'Biểu quyết hòa. Không ai bị treo cổ.';
  } else if (entries[0][0] === BLANK_VOTE) {
    room.resultMessage = 'Biểu quyết chọn Phiếu trắng. Không ai bị treo cổ.';
  } else {
    eliminated = room.players.find(p => p.id === entries[0][0]);
    if (eliminated) {
      eliminated.alive = false;
      room.resultMessage = `${eliminated.name} bị treo cổ.`;
    }
  }

  if (eliminated?.role === 'hunter' && !eliminated.hasUsedHunterShot) {
    room.resultMessage = 'Thợ săn bị treo cổ và được quyền bắn một người.';
    if (queueHunterShot(room, eliminated, 'vote', 'night')) return;
  }

  const winner = checkWin(room.players);
  if (winner) return finishGame(room, winner);

  const voteResultMessage = room.resultMessage;
  room.round += 1;
  beginNight(room, voteResultMessage);
}

export function hunterShot(room, actorId, targetId) {
  ensurePhase(room, 'hunter_shot');
  const pending = room.pendingHunterShot;
  if (!pending || pending.hunterId !== actorId) throw new Error('Bạn không có phát bắn Thợ săn đang chờ xử lý.');
  const hunter = room.players.find(player => player.id === actorId);
  if (!hunter || hunter.role !== 'hunter' || hunter.alive || hunter.hasUsedHunterShot) {
    throw new Error('Thợ săn không thể sử dụng phát bắn này.');
  }
  if (targetId === actorId) throw new Error('Thợ săn không thể tự bắn mình.');
  const target = findAlivePlayer(room, targetId);

  hunter.hasUsedHunterShot = true;
  target.alive = false;
  room.pendingHunterShot = null;
  room.resultMessage = `Thợ săn đã bắn ${target.name}.`;
  continueAfterHunterShot(room, pending.phaseAfterShot);
  return { message: `Bạn đã bắn ${target.name}.` };
}

export function moderatorSkipHunterShot(room, actorId) {
  ensureModerator(room, actorId);
  ensurePhase(room, 'hunter_shot');
  const pending = room.pendingHunterShot;
  if (!pending) throw new Error('Không có phát bắn Thợ săn đang chờ xử lý.');
  const hunter = room.players.find(player => player.id === pending.hunterId);
  if (hunter) hunter.hasUsedHunterShot = true;
  room.pendingHunterShot = null;
  room.resultMessage = 'Người quản trò đã bỏ qua phát bắn của Thợ săn.';
  continueAfterHunterShot(room, pending.phaseAfterShot);
  return { message: 'Đã bỏ qua phát bắn của Thợ săn.' };
}

export function addChat(room, senderId, text) {
  const sender = room.players.find(p => p.id === senderId);
  if (!sender) throw new Error('Không tìm thấy người gửi.');
  if (room.phase === 'night') throw new Error('Ban đêm không được chat.');
  if (!sender.alive) throw new Error('Người chết không được chat.');

  const cleanText = String(text || '').trim().slice(0, 300);
  if (!cleanText) return;

  room.chat.push({
    id: `${Date.now()}-${Math.random()}`,
    senderId,
    senderName: sender.name,
    text: cleanText,
    at: Date.now()
  });

  if (room.chat.length > 80) room.chat.shift();
}

export function checkWin(players) {
  const alive = players.filter(p => p.alive);
  const wolves = alive.filter(p => p.team === 'werewolf');
  const villagers = alive.filter(p => p.team === 'village');

  if (wolves.length === 0) return 'village';
  if (wolves.length >= villagers.length) return 'werewolf';
  return null;
}

export function publicStateFor(room, socketId) {
  const me = room.players.find(p => p.id === socketId);
  const isModerator = room.moderatorId === socketId;
  if (!isModerator && !me) throw new Error('Socket không thuộc phòng này.');
  const showAllRoles = room.status === 'ended';
  const stage = currentStage(room);
  const effectiveWolfVictim = getEffectiveWolfVictim(room);
  const playerCount = room.players.length;
  const suggestedPreset = getSuggestedRolePreset(playerCount);
  const suggestedPresetItems = presetItemsFor(suggestedPreset);
  const unsupportedPresetRoles = suggestedPresetItems.filter(item => !item.isImplemented).map(item => item.role);

  return {
    code: room.code,
    viewerType: isModerator ? 'moderator' : 'player',
    isModerator,
    moderatorDisconnected: room.moderatorDisconnected,
    playerCount,
    suggestedPreset,
    suggestedPresetItems,
    unsupportedPresetRoles,
    suggestedPresetAlternatives: playerCount === 17
      ? [{ key: 'B', label: 'Preset B', items: presetItemsFor(getSuggestedRolePreset(17, 'B')) }]
      : [],
    presetWarning: unsupportedPresetRoles.length > 0
      ? 'Một số vai chưa triển khai sẽ tạm thời được thay bằng Dân làng khi bắt đầu game.'
      : null,
    roleLibrary: isModerator ? Object.values(ROLE_META) : [],
    status: room.status,
    phase: room.phase,
    round: room.round,
    resultMessage: room.resultMessage,
    pendingHunterShot: room.pendingHunterShot
      ? (isModerator || me?.id === room.pendingHunterShot.hunterId
        ? { ...room.pendingHunterShot, isMine: me?.id === room.pendingHunterShot.hunterId }
        : { active: true })
      : null,
    chat: room.chat,
    votesCount: Object.keys(room.votes).length,
    aliveCount: room.players.filter(p => p.alive).length,
    nightTurn: room.currentNightStage,
    nightTurnLabel: stage?.labelVi || null,
    currentNightStage: room.currentNightStage,
    currentNightStageIndex: room.currentNightStageIndex,
    currentNightStageLabel: stage?.labelVi || null,
    isMyNightTurn: Boolean(me?.alive && stage?.isImplemented && stage.roles.includes(me.role) && !room.completedNightStages.includes(stage.key)),
    activeNightStages: isModerator ? [...room.activeNightStages] : null,
    nightOrder: isModerator ? room.activeNightStages.map(key => getStageByKey(key)).filter(Boolean).map(item => ({ key: item.key, role: item.key, label: item.labelVi, isImplemented: item.isImplemented })) : [],
    moderator: isModerator ? {
      id: room.moderatorId,
      name: room.moderatorName,
      disconnected: room.moderatorDisconnected,
      assignedRoleCounts: { ...room.assignedRoleCounts },
      stages: room.activeNightStages.map(key => getStageByKey(key)).filter(Boolean).map(item => ({ ...item, completed: room.completedNightStages.includes(item.key) })),
      prompt: stage?.moderatorPrompt || null,
      expectedPlayers: room.players.filter(p => stage?.roles.includes(p.role)).map(p => ({ id: p.id, name: p.name, role: p.role, roleLabel: ROLE_LABEL[p.role], alive: p.alive })),
      hasAliveActor: room.players.some(p => p.alive && stage?.roles.includes(p.role)),
      noAliveActorMessage: stage && !room.players.some(p => p.alive && stage.roles.includes(p.role))
        ? 'Vai này có trong ván nhưng không còn người sống để hành động. Vẫn gọi lượt này để giữ bí mật.'
        : null,
      nightActions: { ...room.nightActions },
      witchVictimMessage: effectiveWolfVictim ? `Người bị Ma sói cắn: ${effectiveWolfVictim.name}` : 'Không có ai chết do Ma sói trong đêm nay.'
    } : null,
    me: me ? {
      id: me.id,
      name: me.name,
      role: me.role,
      roleLabel: ROLE_LABEL[me.role],
      team: me.team,
      teamLabel: TEAM_LABEL[me.team],
      alive: me.alive,
      hasUsedHunterShot: me.hasUsedHunterShot,
      isModerator: false,
      witchPotions: me.role === 'witch' ? me.witchPotions : null,
      witchVictim: me.role === 'witch' && room.currentNightStage === 'witch'
        ? effectiveWolfVictim?.id || null
        : null
    } : null,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      alive: p.alive,
      isMe: p.id === socketId,
      role: showAllRoles || isModerator || p.id === socketId ? p.role : null,
      roleLabel: showAllRoles || isModerator || p.id === socketId ? ROLE_LABEL[p.role] : null,
      team: showAllRoles || isModerator || p.id === socketId ? p.team : null,
      teamLabel: showAllRoles || isModerator || p.id === socketId ? TEAM_LABEL[p.team] : null
    }))
  };
}

function beginNight(room, message) {
  room.phase = 'night';
  room.votes = {};
  room.nightActions = emptyNightActions();
  room.currentNightStage = null;
  room.currentNightStageIndex = -1;
  room.completedNightStages = [];
  room.resultMessage = message;
  moveToNextStage(room);
}

function queueHunterShot(room, hunter, cause, phaseAfterShot) {
  if (!room.players.some(player => player.alive && player.id !== hunter.id)) return false;
  room.pendingHunterShot = { hunterId: hunter.id, hunterName: hunter.name, cause, phaseAfterShot };
  room.phase = 'hunter_shot';
  return true;
}

function continueAfterHunterShot(room, phaseAfterShot) {
  const winner = checkWin(room.players);
  if (winner) return finishGame(room, winner);
  if (phaseAfterShot === 'night') {
    const message = room.resultMessage;
    room.round += 1;
    return beginNight(room, message);
  }
  room.phase = 'day';
}

function moveToNextStage(room) {
  for (let i = room.currentNightStageIndex + 1; i < room.activeNightStages.length; i += 1) {
    const stage = getStageByKey(room.activeNightStages[i]);
    if (!stage) continue;
    if (stage.firstNightOnly && room.round !== 1) {
      room.completedNightStages.push(stage.key);
      continue;
    }
    room.currentNightStageIndex = i;
    room.currentNightStage = stage.key;
    room.nightTurnIndex = i;
    room.nightTurn = stage.key;
    return { done: false, stage: stage.key, message: `Quản trò đang gọi: ${stage.labelVi}.` };
  }
  return endNight(room) || { done: true };
}

function currentStage(room) {
  return getStageByKey(room.currentNightStage);
}

function completeCurrentStage(room) {
  if (room.currentNightStage && !room.completedNightStages.includes(room.currentNightStage)) {
    room.completedNightStages.push(room.currentNightStage);
  }
}

function getEffectiveWolfVictim(room) {
  const targetId = room.nightActions.werewolfTarget;
  if (!targetId || targetId === room.nightActions.guardTarget) return null;
  return room.players.find(player => player.id === targetId && player.alive) || null;
}

function ensureModerator(room, actorId) {
  if (room.moderatorId !== actorId) throw new Error('Chỉ Người quản trò mới được điều khiển trận đấu.');
}

function canWitchStillAct(player) {
  return Boolean(player.witchPotions?.heal || player.witchPotions?.poison);
}

function buildRoleDeck(count) {
  const preset = getSuggestedRolePreset(count);
  const roles = [];

  for (const [role, amount] of Object.entries(preset)) {
    const assignedRole = ROLE_META[role]?.isImplemented ? role : 'villager';
    for (let i = 0; i < amount; i += 1) roles.push(assignedRole);
  }

  if (roles.length > count) roles.length = count;
  while (roles.length < count) roles.push('villager');

  if (count >= 2 && !roles.includes('werewolf')) roles[0] = 'werewolf';
  if (count >= 2 && roles.every(role => role === 'werewolf')) roles[roles.length - 1] = 'villager';
  if (roles.some(role => !ROLE_META[role]?.isImplemented)) {
    throw new Error('Bộ vai chứa vai chưa được triển khai.');
  }

  return roles;
}

function presetItemsFor(preset) {
  return Object.entries(preset)
    .filter(([, count]) => count > 0)
    .map(([role, count]) => ({
      role,
      count,
      labelVi: ROLE_META[role]?.labelVi || role,
      faction: ROLE_META[role]?.faction || 'special',
      aura: ROLE_META[role]?.aura || 'Không rõ',
      group: ROLE_META[role]?.group || 'Không phân loại',
      isImplemented: Boolean(ROLE_META[role]?.isImplemented),
      description: ROLE_META[role]?.description || 'Chưa triển khai.',
      shortDescription: ROLE_META[role]?.shortDescription || 'Chưa triển khai.'
    }));
}

function countRoles(roles) {
  return roles.reduce((counts, role) => {
    counts[role] = (counts[role] || 0) + 1;
    return counts;
  }, {});
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function ensurePhase(room, phase) {
  if (room.phase !== phase) throw new Error(`Chỉ thực hiện được ở pha ${phase}.`);
}

function findAlivePlayer(room, id) {
  const player = room.players.find(p => p.id === id);
  if (!player) throw new Error('Không tìm thấy người chơi.');
  if (!player.alive) throw new Error('Người chơi này đã chết.');
  return player;
}

function finishGame(room, winner) {
  room.status = 'ended';
  room.phase = 'ended';
  room.nightTurn = null;
  room.nightTurnIndex = -1;
  room.currentNightStage = null;
  room.currentNightStageIndex = -1;
  room.pendingHunterShot = null;
  room.resultMessage = winner === 'village'
    ? 'Dân làng chiến thắng!'
    : 'Ma sói chiến thắng!';
}
