import { emptyNightActions, emptyWolfChildRevenge } from './rooms.js';

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
  wolf_child: roleMeta('wolf_child', 'Sói con', 'Wolf Child', 'werewolf', 'Ác', 'Sói đặc biệt', true, true, 'Sói con thuộc phe Ma Sói. Sói con biết các Ma Sói khác và cùng tham gia biểu quyết cắn người. Nếu Sói con chết, đêm kế tiếp phe Ma Sói nổi giận và được cắn tối đa 2 người.', 'Nếu chết, đêm sau Sói được cắn 2 người.'),
  cursed_villager: roleMeta('cursed_villager', 'Kẻ bị nguyền', 'Cursed Villager', 'village', 'Thiện', 'Dân đặc biệt', true, false, 'Kẻ bị nguyền ban đầu thuộc phe Dân làng. Nếu bị Ma Sói cắn vào ban đêm, người này không chết mà bị biến thành Ma Sói từ đêm sau.', 'Bị Sói cắn thì hóa thành Sói thay vì chết.'),
  cursed_wolf: roleMeta('cursed_wolf', 'Sói nguyền / Kẻ bị nguyền', 'Cursed Wolf', 'werewolf', 'Ác', 'Sói biến thể', false, true, 'Ban đầu mang danh nghĩa dân làng, nhưng nếu bị Sói cắn sẽ lập tức trở thành Ma Sói và gia nhập phe Sói. Đây là vai trò hai mặt, dễ gây rối loạn niềm tin trong phe Dân.', 'Bị Sói cắn sẽ biến thành Sói, chưa triển khai.'),
  wolf_witch: roleMeta('wolf_witch', 'Sói phù thủy', 'Wolf Witch', 'werewolf', 'Ác', 'Sói nâng cao', false, true, 'Ngoài khả năng cắn cùng Sói, còn có thể sử dụng ma thuật để gây nhiễu, ví dụ làm người khác mất khả năng trong một đêm.', 'Sói có phép gây nhiễu ban đêm, chưa triển khai.'),
  wolf_converter: roleMeta('wolf_converter', 'Sói hóa sói', 'Wolf Converter', 'werewolf', 'Ác', 'Sói nâng cao', false, true, 'Có thể hóa sói một dân làng khác để biến họ thành đồng minh. Vai trò này rất mạnh nếu xuất hiện trong nhóm đông người.', 'Có thể biến người khác thành Sói, chưa triển khai.'),
  wolf_medium: roleMeta('wolf_medium', 'Sói thầy đồng', 'Wolf Medium', 'werewolf', 'Ác', 'Sói nâng cao', false, true, 'Có khả năng giao tiếp với người chết và kiểm soát thông tin sai lệch, khiến phe Dân dễ bị nhầm lẫn.', 'Sói thao túng thông tin người chết, chưa triển khai.'),
  silent_wolf: roleMeta('silent_wolf', 'Sói câm lặng', 'Silent Wolf', 'werewolf', 'Ác', 'Sói đặc biệt', false, true, 'Vẫn đi săn cùng Sói bình thường, nhưng ban ngày không được nói hoặc chỉ nói hạn chế. Thường dùng để tăng tính thử thách và làm trò chơi kịch tính hơn.', 'Sói bị hạn chế nói ban ngày, chưa triển khai.'),
  hidden_wolf: roleMeta('hidden_wolf', 'Sói ẩn mình', 'Hidden Wolf', 'werewolf', 'Ác', 'Sói đặc biệt', false, true, 'Có khả năng tránh bị soi bởi Tiên tri trong một số lượt. Đây là nhân vật tàng hình giúp phe Sói tồn tại lâu hơn.', 'Khó bị Tiên tri phát hiện, chưa triển khai.'),
  cursed_magic_wolf: roleMeta('cursed_magic_wolf', 'Sói nguyền rủa', 'Cursed Magic Wolf', 'werewolf', 'Ác', 'Sói nâng cao', false, true, 'Có thể gieo lời nguyền khiến một vai trò phe Dân mất khả năng hoạt động. Thường được thêm vào khi chơi đông để cân bằng.', 'Gieo lời nguyền làm phe Dân mất kỹ năng, chưa triển khai.'),
  cupid: { ...roleMeta('cupid', 'Thần tình yêu', 'Cupid', 'village', 'Thiện', 'Dân đặc biệt', true, true, 'Đêm đầu tiên, Thần tình yêu chọn 2 người chơi để trở thành Cặp đôi. Hai người này biết nhau. Nếu một người chết, người còn lại cũng chết theo vì đau khổ. Nếu Cặp đôi khác phe, họ có thể có điều kiện thắng riêng.', 'Đêm đầu ghép 2 người thành Cặp đôi.'), firstNightOnly: true },
  witch: roleMeta('witch', 'Phù thủy', 'Witch', 'village', 'Trung lập', 'Solo cân bằng', true, true, 'Có hai bình thuốc: một bình cứu người bị Sói cắn và một bình giết một người bất kỳ. Có thể dùng cả hai trong cùng một đêm hoặc để dành. Đây là vai trò rất mạnh, vừa giúp phe Dân vừa có thể gây bất ngờ cho phe Sói.', 'Có một bình cứu và một bình độc.'),
  piper: roleMeta('piper', 'Kẻ thổi sáo', 'Piper', 'solo', 'Trung lập', 'Solo khống chế', false, true, 'Mỗi đêm được chọn hai người để ru ngủ hoặc mê hoặc. Khi tất cả người chơi còn sống đều bị mê hoặc, Kẻ thổi sáo lập tức thắng. Đây là vai trò khó chơi nhưng rất thú vị khi kéo dài trận.', 'Mê hoặc người chơi để đạt điều kiện thắng riêng, chưa triển khai.'),
  thief: roleMeta('thief', 'Kẻ ăn trộm', 'Thief', 'solo', 'Trung lập', 'Solo thay vai', false, true, 'Ban đầu nhận hai lá bài úp của những người không tham gia. Trước khi game bắt đầu, Kẻ ăn trộm phải chọn một trong hai lá để hóa thân thành vai trò đó. Tùy chọn bài mà có thể thành Dân, Sói hoặc một vai Solo khác.', 'Chọn một trong hai lá bài úp để đổi vai, chưa triển khai.'),
  elder: roleMeta('elder', 'Già làng', 'Elder', 'village', 'Thiện', 'Dân đặc biệt', true, false, 'Già làng có sức sống mạnh hơn dân thường. Lần đầu bị Ma Sói cắn, Già làng không chết mà mất đi một mạng. Nếu bị treo cổ, bị Phù thủy đầu độc, hoặc bị Thợ săn bắn thì Già làng vẫn chết bình thường.', 'Sống sót sau lần đầu bị Ma Sói cắn.'),
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
  { key: 'cupid', labelVi: 'Thần tình yêu', roles: ['cupid'], moderatorPrompt: 'Gọi Thần tình yêu thức dậy và chọn hai người để ghép đôi.', playerPrompt: 'Chọn đúng 2 người chơi để ghép thành Cặp đôi.', isImplemented: true, canSkipIfNoRole: true, firstNightOnly: true },
  { key: 'wolf_special', labelVi: 'Sói đặc biệt', roles: ['alpha_wolf'], moderatorPrompt: 'Gọi các vai Sói đặc biệt trước. Chưa triển khai vai này.', playerPrompt: 'Chờ Quản trò điều phối.', isImplemented: false, canSkipIfNoRole: true },
  { key: 'werewolf', labelVi: 'Sói', roles: ['werewolf'], moderatorPrompt: 'Gọi Sói thức dậy và chọn một người để cắn.', playerPrompt: 'Chọn một người để cắn.', isImplemented: true, canSkipIfNoRole: true },
  { key: 'guard', labelVi: 'Bảo vệ', roles: ['guard'], moderatorPrompt: 'Gọi Bảo vệ thức dậy và chọn một người để bảo vệ.', playerPrompt: 'Chọn một người để bảo vệ.', isImplemented: true, canSkipIfNoRole: true },
  { key: 'witch', labelVi: 'Phù thủy', roles: ['witch'], moderatorPrompt: 'Gọi Phù thủy thức dậy. Nếu có người bị cắn, thông báo riêng cho Phù thủy.', playerPrompt: 'Cân nhắc dùng bình cứu hoặc bình độc.', isImplemented: true, canSkipIfNoRole: true },
  { key: 'cursed', labelVi: 'Kẻ bị nguyền', roles: ['cursed_wolf'], moderatorPrompt: 'Vai này chưa triển khai, có thể bỏ qua.', playerPrompt: 'Chờ Quản trò điều phối.', isImplemented: false, canSkipIfNoRole: true },
  { key: 'seer', labelVi: 'Tiên tri', roles: ['seer'], moderatorPrompt: 'Gọi Tiên tri thức dậy và chọn một người để soi.', playerPrompt: 'Chọn một người để soi phe.', isImplemented: true, canSkipIfNoRole: true },
  { key: 'other_roles', labelVi: 'Các chức năng khác', roles: [], moderatorPrompt: 'Vai này chưa triển khai, có thể bỏ qua.', playerPrompt: 'Chờ Quản trò điều phối.', isImplemented: false, canSkipIfNoRole: true },
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
  '17A': { seer: 1, guard: 1, hunter: 1, cupid: 1, witch: 1, elder: 1, cursed_villager: 1, wolf_child: 1, werewolf: 3, villager: 6 },
  '17B': { seer: 1, guard: 1, hunter: 1, cupid: 1, witch: 1, elder: 1, cursed_villager: 1, wolf_child: 1, werewolf: 3, villager: 6 },
  18: { seer: 1, guard: 1, hunter: 1, cupid: 1, witch: 1, elder: 1, cursed_villager: 1, wolf_child: 1, werewolf: 3, villager: 7 }
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
    player.originalRole = player.role;
    player.alive = true;
    player.connected = true;
    player.left = false;
    player.leftAt = null;
    player.hasUsedHunterShot = false;
    player.hasTriggeredWolfChildRevenge = false;
    player.elderLives = player.role === 'elder' ? 2 : 1;
    player.isConvertedWerewolf = false;
    player.convertedAtRound = null;
    player.isLover = false;
    player.loverPartnerId = null;
    player.witchPotions = player.role === 'witch'
      ? { heal: true, poison: true }
      : null;
  });

  room.status = 'playing';
  room.lovers = null;
  room.wolfChildRevenge = emptyWolfChildRevenge();
  room.moderatorNotes = [];
  room.round = 1;
  room.votes = {};
  room.chat = [];
  beginNight(room, 'Đêm đầu tiên bắt đầu.');
}

export function doNightAction(room, actorId, targetId, action, targetIds) {
  ensurePhase(room, 'night');
  const actor = findAlivePlayer(room, actorId);

  const stage = currentStage(room);
  if (!stage) throw new Error('Đêm đã xử lý xong.');
  const isActingWerewolf = stage.key === 'werewolf' && isWerewolfTeam(actor);
  if (!stage.isImplemented || (!stage.roles.includes(actor.role) && !isActingWerewolf)) {
    throw new Error(`Chưa tới lượt ${ROLE_LABEL[actor.role] || 'vai của bạn'}. Hiện tại Quản trò đang gọi ${stage.labelVi}.`);
  }
  if (actor.connected === false || actor.left) throw new Error('Người chơi đã rời phòng hoặc mất kết nối.');

  if (actor.role === 'cupid') {
    return doCupidAction(room, actor, targetIds);
  }

  if (actor.role === 'witch') {
    return doWitchAction(room, actor, targetId, action);
  }

  if (!isActingWerewolf && room.nightActions.acted[actor.role]) {
    throw new Error(`${ROLE_LABEL[actor.role]} đã hành động trong đêm này rồi.`);
  }

  if (isActingWerewolf) {
    const selectedIds = normalizeWerewolfTargetIds(targetId, targetIds, getWerewolfMaxTargets(room));
    const selectedTargets = selectedIds.map(id => findAlivePlayer(room, id));
    selectedTargets.forEach(target => {
      if (isWerewolfTeam(target)) throw new Error('Ma Sói không thể cắn đồng đội.');
    });
    room.nightActions.werewolfVotes[actor.id] = { targetIds: selectedTargets.map(target => target.id) };
    const summary = refreshWerewolfTarget(room);
    return {
      type: 'werewolf',
      message: summary.finalTargets.length
        ? `Sói đã thống nhất mục tiêu: ${summary.finalTargets.map(target => target.name).join(', ')}.`
        : 'Bạn đã chọn mục tiêu. Sói chưa thống nhất mục tiêu.'
    };
  }

  const target = findAlivePlayer(room, targetId);

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
      message: `${target.name} thuộc ${TEAM_LABEL[isWerewolfTeam(target) ? 'werewolf' : 'village']}.`
    };
  }

  throw new Error('Vai của bạn không có hành động ban đêm.');
}

export function skipNightTurn(room, actorId) {
  ensurePhase(room, 'night');
  if (!room.currentNightStage) throw new Error('Không có lượt đêm để bỏ qua.');

  const actor = room.players.find(p => p.id === actorId);
  const stage = currentStage(room);
  const isCurrentRole = actor?.alive && actor.connected !== false && !actor.left && playerMatchesStage(actor, stage);

  if (!isCurrentRole) {
    throw new Error('Chỉ người chơi đang tới lượt mới được bỏ qua lượt hiện tại.');
  }
  if (isWerewolfTeam(actor)) throw new Error('Ma Sói hãy bỏ phiếu mục tiêu hoặc chờ Quản trò bỏ qua lượt.');

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
  if (!['heal', 'poison', 'skip_heal', 'skip_poison'].includes(action)) {
    throw new Error('Phù thủy hãy chọn dùng bình cứu hoặc bình độc.');
  }

  if (action === 'skip_heal') {
    if (actor.witchPotions?.heal) {
      room.nightActions.witchHealDecision = 'skipped';
    } else {
      room.nightActions.witchHealDecision = 'unavailable';
    }
    if (isWitchStageResolved(room, actor)) completeCurrentStage(room);
    return { type: 'witch', message: 'Bạn đã không dùng bình cứu.' };
  }

  if (action === 'skip_poison') {
    room.nightActions.witchPoisonDecision = actor.witchPotions?.poison ? 'skipped' : 'unavailable';
    if (isWitchStageResolved(room, actor)) completeCurrentStage(room);
    return { type: 'witch', message: 'Bạn đã không dùng bình độc.' };
  }

  if (!actor.witchPotions?.[action]) {
    throw new Error(action === 'heal' ? 'Bình cứu đã được dùng.' : 'Bình độc đã được dùng.');
  }

  if (action === 'heal') {
    if (room.nightActions.witchHealDecision === 'used') throw new Error('Bình cứu đã dùng.');
    const wolfVictims = getEffectiveWolfVictims(room);
    const wolfTargetId = targetId || (wolfVictims.length === 1 ? wolfVictims[0].id : null);
    if (!wolfVictims.length) throw new Error('Đêm nay không có ai đang chết vì Ma sói.');
    if (!wolfTargetId || !wolfVictims.some(victim => victim.id === wolfTargetId)) throw new Error('Hãy chọn một nạn nhân bị Ma Sói cắn để cứu.');
    const target = findAlivePlayer(room, wolfTargetId);
    if (room.nightActions.witchPoisonTarget === target.id) {
      throw new Error('Không thể vừa cứu vừa độc cùng một người trong một đêm.');
    }

    room.nightActions.witchHealTarget = target.id;
    room.nightActions.witchHealDecision = 'used';
    actor.witchPotions.heal = false;
    if (isWitchStageResolved(room, actor)) completeCurrentStage(room);
    return { type: 'witch', message: `Đã dùng bình cứu cho ${target.name}.` };
  }

  if (room.nightActions.witchPoisonDecision === 'used') throw new Error('Bình độc đã dùng.');
  const target = findAlivePlayer(room, targetId);
  if (target.id === actor.id) throw new Error('Phù thủy không thể tự dùng bình độc.');
  if (room.nightActions.witchHealTarget === target.id) {
    throw new Error('Không thể vừa cứu vừa độc cùng một người trong một đêm.');
  }

  room.nightActions.witchPoisonTarget = target.id;
  room.nightActions.witchPoisonDecision = 'used';
  actor.witchPotions.poison = false;
  if (isWitchStageResolved(room, actor)) completeCurrentStage(room);
  return { type: 'witch', message: `Đã dùng bình độc lên ${target.name}.` };
}

export function endNight(room) {
  ensurePhase(room, 'night');

  const wolfTargetIds = getFinalWerewolfTargetIds(room);
  const wolfTargetId = wolfTargetIds[0] || null;
  const guardTargetId = room.nightActions.guardTarget;
  const healTargetId = room.nightActions.witchHealTarget;
  const poisonTargetId = room.nightActions.witchPoisonTarget;
  const deaths = new Set();

  if (!wolfTargetIds.length) {
    room.resultMessage = 'Đêm qua không có ai bị ma sói cắn.';
  } else {
    let biteHadEffect = false;
    for (const target of wolfTargetIds) {
      if (target === guardTargetId || target === healTargetId) continue;
      const victim = room.players.find(p => p.id === target && p.alive);
      if (!victim) continue;
      biteHadEffect = true;
      const poisonAlsoKillsVictim = poisonTargetId === target;
      if (!poisonAlsoKillsVictim && victim.role === 'elder' && (victim.elderLives || 1) > 1) {
        victim.elderLives -= 1;
        addModeratorNote(room, 'Già làng đã mất một mạng vì bị Ma Sói cắn.');
      } else if (!poisonAlsoKillsVictim && victim.role === 'cursed_villager' && !victim.isConvertedWerewolf) {
        convertCursedVillager(room, victim);
        addModeratorNote(room, 'Kẻ bị nguyền đã hóa thành Ma Sói.');
      } else {
        deaths.add(victim.id);
      }
    }
    if (!biteHadEffect) room.resultMessage = 'Không ai chết vì Ma sói trong đêm qua.';
    else room.resultMessage = 'Đêm qua không có ai chết.';
  }

  if (poisonTargetId) deaths.add(poisonTargetId);

  const { victims, heartbreakVictims } = applyDeaths(room, [...deaths]);
  const wolfChildMessage = triggerWolfChildRevenge(room, victims);

  if (victims.length > 0) {
    room.resultMessage = `Sáng nay, ${victims.map(p => p.name).join(' và ')} đã chết.`;
    if (heartbreakVictims.length) room.resultMessage += ` ${heartbreakVictims.map(player => `${player.name} cũng chết vì đau khổ.`).join(' ')}`;
  }
  if (wolfChildMessage) room.resultMessage += ` ${wolfChildMessage}`;

  finishWolfChildRevengeNight(room);

  room.currentNightStage = null;
  room.currentNightStageIndex = -1;
  room.completedNightStages = [];
  room.nightTurn = null;
  room.nightTurnIndex = -1;
  room.nightActions = emptyNightActions();
  room.votes = {};

  const deadHunter = victims.find(player => player.role === 'hunter' && !player.hasUsedHunterShot);
  if (deadHunter) {
    const killedByWolves = wolfTargetIds.includes(deadHunter.id) && deadHunter.id !== guardTargetId && deadHunter.id !== healTargetId;
    const cause = heartbreakVictims.some(player => player.id === deadHunter.id)
      ? 'heartbreak'
      : poisonTargetId === deadHunter.id && !killedByWolves ? 'poison' : 'night';
    if (queueHunterShot(room, deadHunter, cause, 'day')) return;
  }
  const winner = checkWin(room.players, room.lovers);
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
  const voter = findAlivePlayer(room, voterId);
  ensureConnectedPlayer(voter);
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
  let deathResult = { victims: [], heartbreakVictims: [] };
  if (entries.length === 0) {
    room.resultMessage = 'Không có ai bị treo cổ vì chưa có phiếu hợp lệ.';
  } else if (entries.length > 1 && entries[0][1] === entries[1][1]) {
    room.resultMessage = 'Biểu quyết hòa. Không ai bị treo cổ.';
  } else if (entries[0][0] === BLANK_VOTE) {
    room.resultMessage = 'Biểu quyết chọn Phiếu trắng. Không ai bị treo cổ.';
  } else {
    eliminated = room.players.find(p => p.id === entries[0][0]);
    if (eliminated) {
      deathResult = applyDeaths(room, [eliminated.id]);
      room.resultMessage = `${eliminated.name} bị treo cổ.`;
      if (deathResult.heartbreakVictims.length) room.resultMessage += ` ${deathResult.heartbreakVictims.map(player => `${player.name} cũng chết vì đau khổ.`).join(' ')}`;
      const wolfChildMessage = triggerWolfChildRevenge(room, deathResult.victims);
      if (wolfChildMessage) room.resultMessage += ` ${wolfChildMessage}`;
    }
  }

  const deadHunter = deathResult.victims.find(player => player.role === 'hunter' && !player.hasUsedHunterShot);
  if (deadHunter) {
    room.resultMessage += ' Thợ săn được quyền bắn một người.';
    const cause = deathResult.heartbreakVictims.some(player => player.id === deadHunter.id) ? 'heartbreak' : 'vote';
    if (queueHunterShot(room, deadHunter, cause, 'night')) return;
  }

  const winner = checkWin(room.players, room.lovers);
  if (winner) return finishGame(room, winner);

  const voteResultMessage = room.resultMessage;
  room.round += 1;
  beginNight(room, voteResultMessage);
}

function doCupidAction(room, actor, targetIds) {
  if (room.round !== 1 || room.currentNightStage !== 'cupid') throw new Error('Thần tình yêu chỉ hành động trong đêm đầu tiên.');
  if (room.lovers) throw new Error('Cặp đôi đã được tạo.');
  if (!Array.isArray(targetIds) || targetIds.length !== 2) throw new Error('Hãy chọn đúng 2 người chơi để ghép đôi.');
  if (targetIds[0] === targetIds[1]) throw new Error('Không thể ghép một người với chính họ.');
  const lovers = targetIds.map(id => findAlivePlayer(room, id));
  const [first, second] = lovers;
  room.lovers = {
    playerIds: [first.id, second.id],
    createdBy: actor.id,
    createdAt: Date.now(),
    mixedFaction: isWerewolfTeam(first) !== isWerewolfTeam(second)
  };
  first.isLover = true;
  first.loverPartnerId = second.id;
  second.isLover = true;
  second.loverPartnerId = first.id;
  room.nightActions.acted.cupid = true;
  completeCurrentStage(room);
  return { type: 'cupid', message: `Bạn đã ghép đôi ${first.name} và ${second.name}.` };
}

export function refreshWerewolfTarget(room) {
  const eligibleWolves = room.players.filter(player => player.alive && isWerewolfTeam(player) && player.connected !== false && !player.left);
  const eligibleIds = new Set(eligibleWolves.map(player => player.id));
  const maxTargets = getWerewolfMaxTargets(room);
  const validVotes = {};

  for (const [wolfId, vote] of Object.entries(room.nightActions.werewolfVotes || {})) {
    if (!eligibleIds.has(wolfId)) continue;
    const candidateIds = Array.isArray(vote?.targetIds) ? vote.targetIds : vote ? [vote] : [];
    const targetIds = unique(candidateIds).filter(targetId => room.players.some(player => player.id === targetId && player.alive && !isWerewolfTeam(player))).slice(0, maxTargets);
    if (targetIds.length) validVotes[wolfId] = { targetIds };
  }
  room.nightActions.werewolfVotes = validVotes;

  const counts = Object.values(validVotes).reduce((result, vote) => {
    vote.targetIds.forEach(targetId => { result[targetId] = (result[targetId] || 0) + 1; });
    return result;
  }, {});
  const winners = Object.entries(counts)
    .filter(([, count]) => count > eligibleWolves.length / 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTargets)
    .map(([targetId]) => targetId);
  room.nightActions.werewolfTargets = winners;
  room.nightActions.werewolfTarget = winners[0] || null;
  const finalTargets = winners.map(targetId => room.players.find(player => player.id === targetId)).filter(Boolean);
  return { eligibleWolves, votedCount: Object.keys(validVotes).length, finalTargets, finalTarget: finalTargets[0] || null, maxTargets };
}

export function hunterShot(room, actorId, targetId) {
  ensurePhase(room, 'hunter_shot');
  const pending = room.pendingHunterShot;
  if (!pending || pending.hunterId !== actorId) throw new Error('Bạn không có phát bắn Thợ săn đang chờ xử lý.');
  const hunter = room.players.find(player => player.id === actorId);
  if (!hunter || hunter.role !== 'hunter' || hunter.alive || hunter.hasUsedHunterShot || hunter.connected === false || hunter.left) {
    throw new Error('Thợ săn không thể sử dụng phát bắn này.');
  }
  if (targetId === actorId) throw new Error('Thợ săn không thể tự bắn mình.');
  const target = findAlivePlayer(room, targetId);

  hunter.hasUsedHunterShot = true;
  const deathResult = applyDeaths(room, [target.id]);
  const wolfChildMessage = triggerWolfChildRevenge(room, deathResult.victims);
  room.pendingHunterShot = null;
  room.resultMessage = `Thợ săn đã bắn ${target.name}.`;
  if (deathResult.heartbreakVictims.length) room.resultMessage += ` ${deathResult.heartbreakVictims.map(player => `${player.name} cũng chết vì đau khổ.`).join(' ')}`;
  if (wolfChildMessage) room.resultMessage += ` ${wolfChildMessage}`;
  const nextHunter = deathResult.victims.find(player => player.role === 'hunter' && !player.hasUsedHunterShot);
  if (nextHunter && queueHunterShot(room, nextHunter, deathResult.heartbreakVictims.some(player => player.id === nextHunter.id) ? 'heartbreak' : 'hunter_shot', pending.phaseAfterShot)) {
    return { message: `Bạn đã bắn ${target.name}.` };
  }
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
  ensureConnectedPlayer(sender);
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

export function applyDeaths(room, playerIds) {
  const requestedIds = new Set(playerIds);
  const victims = room.players.filter(player => requestedIds.has(player.id) && player.alive);
  victims.forEach(player => { player.alive = false; });
  const heartbreakVictims = [];

  if (room.lovers?.playerIds?.some(id => requestedIds.has(id))) {
    const partner = room.players.find(player => room.lovers.playerIds.includes(player.id) && player.alive);
    if (partner) {
      partner.alive = false;
      victims.push(partner);
      heartbreakVictims.push(partner);
    }
  }
  return { victims, heartbreakVictims };
}

export function checkWin(players, lovers = null) {
  const alive = players.filter(p => p.alive);
  const wolves = alive.filter(isWerewolfTeam);
  const villagers = alive.filter(p => !isWerewolfTeam(p));
  const livingLovers = lovers?.playerIds?.filter(id => alive.some(player => player.id === id)) || [];

  if (livingLovers.length === 2 && alive.length === 2) return 'lovers';
  if (lovers?.mixedFaction && livingLovers.length === 2 && alive.length > 2) return null;

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
  const wolfVoteSummary = refreshWerewolfTarget(room);
  const loverPartner = me?.loverPartnerId ? room.players.find(player => player.id === me.loverPartnerId) : null;
  const cupidSelection = me?.role === 'cupid' && room.lovers?.createdBy === me.id
    ? room.lovers.playerIds.map(id => room.players.find(player => player.id === id)).filter(Boolean)
    : [];

  return {
    code: room.code,
    viewerType: isModerator ? 'moderator' : 'player',
    isModerator,
    moderatorDisconnected: room.moderatorDisconnected,
    moderatorConnected: room.moderatorConnected !== false,
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
    ...(isWerewolfTeam(me) && stage?.key === 'werewolf' ? {
      werewolfNightInfo: serializeWerewolfNightInfo(room, wolfVoteSummary, me.id)
    } : {}),
    ...(loverPartner ? {
      loverInfo: {
        partnerId: loverPartner.id,
        partnerName: loverPartner.name,
        partnerAlive: loverPartner.alive,
        partnerConnected: loverPartner.connected !== false,
        partnerLeft: Boolean(loverPartner.left)
      }
    } : {}),
    ...(me?.role === 'cupid' ? {
      cupidInfo: { selectedNames: cupidSelection.map(player => player.name), completed: cupidSelection.length === 2 }
    } : {}),
    chat: room.chat,
    votesCount: Object.keys(room.votes).length,
    aliveCount: room.players.filter(p => p.alive).length,
    nightTurn: room.currentNightStage,
    nightTurnLabel: stage?.labelVi || null,
    currentNightStage: room.currentNightStage,
    currentNightStageIndex: room.currentNightStageIndex,
    currentNightStageLabel: stage?.labelVi || null,
    isMyNightTurn: Boolean(me?.alive && me.connected !== false && !me.left && stage?.isImplemented && playerMatchesStage(me, stage) && !room.completedNightStages.includes(stage.key)),
    activeNightStages: isModerator ? [...room.activeNightStages] : null,
    nightOrder: isModerator ? room.activeNightStages.map(key => getStageByKey(key)).filter(Boolean).map(item => ({ key: item.key, role: item.key, label: item.labelVi, isImplemented: item.isImplemented })) : [],
    moderator: isModerator ? {
      id: room.moderatorId,
      name: room.moderatorName,
      disconnected: room.moderatorDisconnected,
      connected: room.moderatorConnected !== false,
      assignedRoleCounts: { ...room.assignedRoleCounts },
      stages: room.activeNightStages.map(key => getStageByKey(key)).filter(Boolean).map(item => ({ ...item, completed: room.completedNightStages.includes(item.key) })),
      prompt: stage?.moderatorPrompt || null,
      expectedPlayers: room.players.filter(p => playerMatchesStage(p, stage)).map(p => ({ id: p.id, name: p.name, role: p.role, roleLabel: ROLE_LABEL[p.role], alive: p.alive })),
      hasAliveActor: room.players.some(p => p.alive && p.connected !== false && !p.left && playerMatchesStage(p, stage)),
      noAliveActorMessage: stage && !room.players.some(p => p.alive && p.connected !== false && !p.left && playerMatchesStage(p, stage))
        ? 'Vai này có trong ván nhưng không còn người sống để hành động. Vẫn gọi lượt này để giữ bí mật.'
        : null,
      nightActions: { ...room.nightActions, werewolfVotes: { ...room.nightActions.werewolfVotes } },
      werewolfVoteStatus: stage?.key === 'werewolf' ? serializeWerewolfVoteStatus(room, wolfVoteSummary, true) : null,
      werewolfNightInfo: stage?.key === 'werewolf' ? serializeWerewolfNightInfo(room, wolfVoteSummary) : null,
      witchActionStatus: stage?.key === 'witch' ? serializeWitchActionStatus(room) : null,
      wolfChildRevenge: serializeWolfChildRevenge(room),
      moderatorLoversInfo: serializeModeratorLoversInfo(room),
      moderatorNotes: [...(room.moderatorNotes || [])],
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
      connected: me.connected !== false,
      left: Boolean(me.left),
      hasUsedHunterShot: me.hasUsedHunterShot,
      elderLives: me.role === 'elder' ? me.elderLives : null,
      elderMaxLives: me.role === 'elder' ? 2 : null,
      originalRole: me.originalRole,
      isConvertedWerewolf: Boolean(me.isConvertedWerewolf),
      convertedAtRound: me.convertedAtRound,
      isModerator: false,
      witchPotions: me.role === 'witch' ? me.witchPotions : null,
      witchVictim: me.role === 'witch' && room.currentNightStage === 'witch'
        ? effectiveWolfVictim?.id || null
        : null,
      ...(me.role === 'witch' && room.currentNightStage === 'witch' ? {
        witchVictims: getEffectiveWolfVictims(room).map(publicPlayerStatus),
        witchActionStatus: serializeWitchActionStatus(room)
      } : {}),
      ...(isWerewolfTeam(me) ? {
        werewolfTeammates: room.players.filter(player => isWerewolfTeam(player) && player.id !== me.id).map(publicPlayerStatus)
      } : {}),
      ...(isWerewolfTeam(me) && stage?.key === 'werewolf' ? {
        werewolfVote: room.nightActions.werewolfVotes?.[me.id] || null,
        werewolfVoteStatus: serializeWerewolfVoteStatus(room, wolfVoteSummary, false)
      } : {})
    } : null,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      alive: p.alive,
      connected: p.connected !== false,
      left: Boolean(p.left),
      isMe: p.id === socketId,
      role: showAllRoles || isModerator || p.id === socketId ? p.role : null,
      roleLabel: showAllRoles || isModerator || p.id === socketId ? ROLE_LABEL[p.role] : null,
      team: showAllRoles || isModerator || p.id === socketId ? p.team : null,
      teamLabel: showAllRoles || isModerator || p.id === socketId ? TEAM_LABEL[p.team] : null,
      elderLives: showAllRoles || isModerator || p.id === socketId ? p.elderLives : null,
      isConvertedWerewolf: showAllRoles || isModerator || p.id === socketId ? Boolean(p.isConvertedWerewolf) : false
    }))
  };
}

function beginNight(room, message) {
  room.phase = 'night';
  room.activeNightStages = buildActiveNightStagesFromAssignedRoles(room.players)
    .filter(key => room.round === 1 || !getStageByKey(key)?.firstNightOnly);
  room.votes = {};
  room.nightActions = emptyNightActions();
  maybeActivateWolfChildRevenge(room);
  room.currentNightStage = null;
  room.currentNightStageIndex = -1;
  room.completedNightStages = [];
  room.resultMessage = message;
  moveToNextStage(room);
}

function publicPlayerStatus(player) {
  return { id: player.id, name: player.name, alive: player.alive, connected: player.connected !== false, left: Boolean(player.left) };
}

function serializeModeratorLoversInfo(room) {
  if (!room.lovers) return null;
  const lovers = room.lovers.playerIds.map(id => room.players.find(player => player.id === id)).filter(Boolean);
  return {
    playerIds: [...room.lovers.playerIds],
    names: lovers.map(player => player.name),
    roles: lovers.map(player => player.role),
    roleLabels: lovers.map(player => ROLE_LABEL[player.role]),
    mixedFaction: room.lovers.mixedFaction,
    aliveStatuses: lovers.map(player => ({ id: player.id, name: player.name, alive: player.alive, connected: player.connected !== false, left: Boolean(player.left) }))
  };
}

function serializeWerewolfVoteStatus(room, summary, includeVoters) {
  const status = {
    votedCount: summary.votedCount,
    eligibleCount: summary.eligibleWolves.length,
    maxTargets: summary.maxTargets,
    finalTarget: summary.finalTarget ? { id: summary.finalTarget.id, name: summary.finalTarget.name } : null,
    finalTargets: summary.finalTargets.map(target => ({ id: target.id, name: target.name })),
    resolved: summary.finalTargets.length > 0
  };
  if (includeVoters) {
    status.voters = summary.eligibleWolves.map(wolf => ({ ...publicPlayerStatus(wolf), hasVoted: Boolean(room.nightActions.werewolfVotes?.[wolf.id]) }));
  }
  return status;
}

function serializeWerewolfNightInfo(room, summary, viewerWolfId = null) {
  const wolves = room.players.filter(isWerewolfTeam);
  const votes = wolves.filter(player => player.alive).map(wolf => {
    const vote = room.nightActions.werewolfVotes?.[wolf.id];
    const targetIds = Array.isArray(vote?.targetIds) ? vote.targetIds : vote ? [vote] : [];
    const targets = targetIds.map(targetId => room.players.find(player => player.id === targetId)).filter(Boolean);
    return {
      wolfId: wolf.id,
      wolfName: wolf.name,
      alive: wolf.alive,
      connected: wolf.connected !== false,
      left: Boolean(wolf.left),
      targetId: targetIds[0] || null,
      targetName: targets[0]?.name || null,
      targetIds,
      targetNames: targets.map(target => target.name)
    };
  });
  return {
    teammates: wolves.filter(wolf => wolf.id !== viewerWolfId).map(publicPlayerStatus),
    votes,
    votedCount: summary.votedCount,
    totalAliveWolves: summary.eligibleWolves.length,
    maxTargets: summary.maxTargets,
    isWolfChildRevengeActive: Boolean(room.wolfChildRevenge?.active),
    revengeLabel: room.wolfChildRevenge?.active ? 'Sói con đã chết, phe Sói được cắn 2 người trong đêm nay.' : null,
    finalizedTargetId: summary.finalTarget?.id || null,
    finalizedTargetName: summary.finalTarget?.name || null,
    finalizedTargetIds: summary.finalTargets.map(target => target.id),
    finalizedTargetNames: summary.finalTargets.map(target => target.name),
    isFinalized: summary.finalTargets.length > 0
  };
}

export function isWerewolfTeam(player) {
  return Boolean(player && (player.role === 'werewolf' || player.team === 'werewolf' || player.isConvertedWerewolf));
}

function playerMatchesStage(player, stage) {
  if (!stage) return false;
  return stage.roles.includes(player.role) || (stage.key === 'werewolf' && isWerewolfTeam(player));
}

function serializeWolfChildRevenge(room) {
  const state = room.wolfChildRevenge || emptyWolfChildRevenge();
  return { ...state, maxTargets: getWerewolfMaxTargets(room) };
}

function serializeWitchActionStatus(room) {
  return {
    healDecision: room.nightActions.witchHealDecision || (getEffectiveWolfVictims(room).length ? 'pending' : 'unavailable'),
    poisonDecision: room.nightActions.witchPoisonDecision || 'pending',
    healTargetId: room.nightActions.witchHealTarget,
    poisonTargetId: room.nightActions.witchPoisonTarget
  };
}

function normalizeWerewolfTargetIds(targetId, targetIds, maxTargets) {
  const ids = Array.isArray(targetIds) ? targetIds : targetId ? [targetId] : [];
  const selected = unique(ids).slice(0, maxTargets);
  if (!selected.length) throw new Error('Ma Sói hãy chọn ít nhất một mục tiêu.');
  return selected;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function getWerewolfMaxTargets(room) {
  return room.wolfChildRevenge?.active && !room.wolfChildRevenge?.used ? 2 : 1;
}

function getFinalWerewolfTargetIds(room) {
  const targets = Array.isArray(room.nightActions.werewolfTargets) ? room.nightActions.werewolfTargets : [];
  return targets.length ? targets : room.nightActions.werewolfTarget ? [room.nightActions.werewolfTarget] : [];
}

function getEffectiveWolfVictims(room) {
  return getFinalWerewolfTargetIds(room)
    .filter(targetId => targetId !== room.nightActions.guardTarget)
    .map(targetId => room.players.find(player => player.id === targetId && player.alive))
    .filter(Boolean);
}

function maybeActivateWolfChildRevenge(room) {
  if (room.wolfChildRevenge?.pending && !room.wolfChildRevenge.used) {
    room.wolfChildRevenge.pending = false;
    room.wolfChildRevenge.active = true;
    room.wolfChildRevenge.activeRound = room.round;
  }
}

function finishWolfChildRevengeNight(room) {
  if (!room.wolfChildRevenge?.active) return;
  room.wolfChildRevenge.active = false;
  room.wolfChildRevenge.pending = false;
  room.wolfChildRevenge.used = true;
}

function triggerWolfChildRevenge(room, victims) {
  const wolfChild = victims.find(player => player.role === 'wolf_child' && !player.hasTriggeredWolfChildRevenge);
  if (!wolfChild || room.wolfChildRevenge?.used) return '';
  wolfChild.hasTriggeredWolfChildRevenge = true;
  room.wolfChildRevenge = {
    ...(room.wolfChildRevenge || emptyWolfChildRevenge()),
    pending: true,
    active: false,
    used: false,
    triggeredById: wolfChild.id,
    triggeredByName: wolfChild.name,
    triggeredAtRound: room.round,
    activeRound: null
  };
  return 'Sói con đã chết. Đêm tới Ma Sói sẽ nổi giận.';
}

function convertCursedVillager(room, player) {
  player.team = 'werewolf';
  player.isConvertedWerewolf = true;
  player.convertedAtRound = room.round;
  refreshLoverFaction(room);
}

function addModeratorNote(room, message) {
  room.moderatorNotes = [...(room.moderatorNotes || []), { id: `${Date.now()}-${room.moderatorNotes?.length || 0}`, round: room.round, message }].slice(-12);
}

function refreshLoverFaction(room) {
  if (!room.lovers?.playerIds?.length) return;
  const lovers = room.lovers.playerIds.map(id => room.players.find(player => player.id === id)).filter(Boolean);
  if (lovers.length === 2) room.lovers.mixedFaction = isWerewolfTeam(lovers[0]) !== isWerewolfTeam(lovers[1]);
}

function queueHunterShot(room, hunter, cause, phaseAfterShot) {
  if (!room.players.some(player => player.alive && player.id !== hunter.id)) return false;
  room.pendingHunterShot = { hunterId: hunter.id, hunterName: hunter.name, cause, phaseAfterShot };
  room.phase = 'hunter_shot';
  return true;
}

function continueAfterHunterShot(room, phaseAfterShot) {
  const winner = checkWin(room.players, room.lovers);
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
  return getEffectiveWolfVictims(room)[0] || null;
}

function ensureModerator(room, actorId) {
  if (room.moderatorId !== actorId || room.moderatorConnected === false) throw new Error('Chỉ Người quản trò đang kết nối mới được điều khiển trận đấu.');
}

function isWitchStageResolved(room, player) {
  const healResolved = !player.witchPotions?.heal || !getEffectiveWolfVictims(room).length || ['used', 'skipped', 'unavailable'].includes(room.nightActions.witchHealDecision);
  const poisonResolved = !player.witchPotions?.poison || ['used', 'skipped', 'unavailable'].includes(room.nightActions.witchPoisonDecision);
  return healResolved && poisonResolved;
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

function ensureConnectedPlayer(player) {
  if (player.connected === false || player.left) throw new Error('Người chơi đã rời phòng hoặc mất kết nối.');
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
    : winner === 'lovers'
      ? 'Cặp đôi chiến thắng. Tình yêu là phe sống sót cuối cùng.'
    : 'Ma sói chiến thắng!';
}
