var levenshtein = (function(){

	function compare (s1, s2) {

		console.log("Called");

		if (s1 == s2) {
			return 0;
		}

		var s1_len = s1.length;
		var s2_len = s2.length;
		
		if (s1_len === 0) {
			return s2_len;
		}

		if (s2_len === 0) {
			return s1_len;
		}

		var v0 = new Array(s1_len + 1);
		var v1 = new Array(s1_len + 1);

		var s1_idx = 0,
		s2_idx = 0,
		cost = 0;

		while(s1_idx < s1_len + 1){
			
			v0[s1_idx] = s1_idx;
			
			s1_idx += 1;
		}
		
		var char_s1 = [],
		char_s2 = [];

		while(s2_idx <= s2_len){
			
			v1[0] = s2_idx;
			char_s2 = s2[s2_idx - 1];

			s1_idx = 0;

			while(s1_idx < s1_len){

				char_s1 = s1[s1_idx];
				cost = (char_s1 == char_s2) ? 0 : 1;
			
				var m_min = v0[s1_idx + 1] + 1;
				var b = v1[s1_idx] + 1;
				var c = v0[s1_idx] + cost;
			
				if (b < m_min) {
					m_min = b;
				}
				
				if (c < m_min) {
					m_min = c;
				}

				v1[s1_idx + 1] = m_min;
			
				s1_idx += 1;

			}

			var v_tmp = v0;
			v0 = v1;
			v1 = v_tmp;

			s2_idx += 1;

		}

		return v0[s1_len];
	
	}

	return {
		compare : compare
	};

})();